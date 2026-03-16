<?php

namespace Trexzactyl\Services\Helpers;

use Illuminate\Support\Facades\Cache;

class VersionService
{
    /**
     * Get the current application version.
     *
     * @return string
     */
    public static function getCurrentVersion(): string
    {
        // Try to get version from environment first
        if ($version = env('APP_VERSION')) {
            return $version;
        }

        // Cache the version for 1 hour to avoid reading file on every request
        return Cache::remember('app_version', 3600, function () {
            // Try package.json first (Prioritized per user request)
            $packagePath = base_path('package.json');
            if (file_exists($packagePath)) {
                $packageJson = json_decode(file_get_contents($packagePath), true);
                if (isset($packageJson['version'])) {
                    return $packageJson['version'];
                }
            }

            // Try composer.json
            $composerPath = base_path('composer.json');
            if (file_exists($composerPath)) {
                $composerJson = json_decode(file_get_contents($composerPath), true);
                if (isset($composerJson['version'])) {
                    return $composerJson['version'];
                }
            }

            // Fallback to git tag if available
            if (file_exists(base_path('.git'))) {
                $gitTag = shell_exec('cd ' . base_path() . ' && git describe --tags --abbrev=0 2>/dev/null');
                if ($gitTag && is_string($gitTag)) {
                    $gitTag = trim($gitTag);
                    if ($gitTag) {
                        return ltrim($gitTag, 'v');
                    }
                }
            }

            // Ultimate fallback
            return '3.7.4';
        });
    }

    /**
     * Clear the cached version.
     *
     * @return void
     */
    public static function clearCache(): void
    {
        Cache::forget('app_version');
    }
}
