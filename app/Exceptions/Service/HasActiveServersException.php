<?php

namespace Trexzactyl\Exceptions\Service;

use Illuminate\Http\Response;
use Trexzactyl\Exceptions\DisplayException;

class HasActiveServersException extends DisplayException
{
    public function getStatusCode(): int
    {
        return Response::HTTP_BAD_REQUEST;
    }
}
