<?php

namespace Trexzactyl\Exceptions\Service\Database;

use Trexzactyl\Exceptions\TrexzactylException;

class DatabaseClientFeatureNotEnabledException extends TrexzactylException
{
    public function __construct()
    {
        parent::__construct('Client database creation is not enabled in this Panel.');
    }
}
