<?php

namespace Trexzactyl\Repositories\Eloquent;

use Trexzactyl\Models\ServerVariable;
use Trexzactyl\Contracts\Repository\ServerVariableRepositoryInterface;

class ServerVariableRepository extends EloquentRepository implements ServerVariableRepositoryInterface
{
    /**
     * Return the model backing this repository.
     */
    public function model(): string
    {
        return ServerVariable::class;
    }
}
