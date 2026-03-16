<?php

namespace Trexzactyl\Exceptions\Service\Location;

use Illuminate\Http\Response;
use Trexzactyl\Exceptions\DisplayException;

class HasActiveNodesException extends DisplayException
{
    public function getStatusCode(): int
    {
        return Response::HTTP_BAD_REQUEST;
    }
}
