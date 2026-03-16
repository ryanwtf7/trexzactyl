<?php

namespace Trexzactyl\Exceptions\Service\Allocation;

use Trexzactyl\Exceptions\DisplayException;

class NoAutoAllocationSpaceAvailableException extends DisplayException
{
    /**
     * NoAutoAllocationSpaceAvailableException constructor.
     */
    public function __construct()
    {
        parent::__construct(
            'Cannot assign additional allocation: no more space available on node.'
        );
    }
}
