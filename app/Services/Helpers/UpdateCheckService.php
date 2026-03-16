<?php

namespace Trexzactyl\Services\Helpers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UpdateCheckService
{
    private const GITHUB_API_URL = 'https://api.github.com/repos/Trexzactyl/Trexzactyl/releases/latest';
    private const CACHE_KEY = 'trexzactyl_latest_version';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get the latest version from GitHub.
     *
     * @return string|null
     */
    public static function getLatestVersion(): ?string
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_DURATION, function () {
            try {
                $response = Http::timeout(5)->get(self::GITHUB_API_URL);

                if ($response->successful()) {
                    $data = $response->json();
                    return isset($data['tag_name']) ? ltrim($data['tag_name'], 'v') : null;
                }
            } catch (\Exception $e) {
                Log::warning('Failed to check for updates: ' . $e->getMessage());
            }

            return null;
        });
    }

    /**
     * Check if an update is available.
     *
     * @return bool
     */
    public static function isUpdateAvailable(): bool
    {
        $currentVersion = VersionService::getCurrentVersion();
        $latestVersion = self::getLatestVersion();

        if (!$latestVersion) {
            return false;
        }

        return version_compare($currentVersion, $latestVersion, '<');
    }

    /**
     * Get update information.
     *
     * @return array
     */
    public static function getUpdateInfo(): array
    {
        $currentVersion = VersionService::getCurrentVersion();
        $latestVersion = self::getLatestVersion();
        $isUpdateAvailable = self::isUpdateAvailable();

        return [
            'current_version' => $currentVersion,
            'latest_version' => $latestVersion,
            'is_update_available' => $isUpdateAvailable,
            'release_url' => $latestVersion 
                ? "https://github.com/Trexzactyl/Trexzactyl/releases/tag/v{$latestVersion}"
                : null,
        ];
    }

    /**
     * Clear the update check cache.
     *
     * @return void
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
