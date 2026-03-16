<?php

namespace Trexzactyl\Repositories\Eloquent;

use Trexzactyl\Models\RecoveryToken;

class RecoveryTokenRepository extends EloquentRepository
{
    public function model(): string
    {
        return RecoveryToken::class;
    }
}
