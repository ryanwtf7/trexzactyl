<?php

namespace Trexzactyl\Http\Controllers\Base;

use Illuminate\View\View;
use Trexzactyl\Http\Controllers\Controller;
use Illuminate\View\Factory as ViewFactory;
use Trexzactyl\Contracts\Repository\ServerRepositoryInterface;

class IndexController extends Controller
{
    /**
     * IndexController constructor.
     */
    public function __construct(
        protected ServerRepositoryInterface $repository,
        protected ViewFactory $view
    ) {
    }

    /**
     * Returns listing of user's servers.
     */
    public function index(): View
    {
        return $this->view->make('templates/base.core');
    }
}
