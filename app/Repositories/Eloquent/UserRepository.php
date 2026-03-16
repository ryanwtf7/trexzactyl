<?php

namespace Trexzactyl\Repositories\Eloquent;

use Trexzactyl\Models\User;
use Trexzactyl\Contracts\Repository\UserRepositoryInterface;

class UserRepository extends EloquentRepository implements UserRepositoryInterface
{
    /**
     * Return the model backing this repository.
     */
    public function model(): string
    {
        return User::class;
    }
}
