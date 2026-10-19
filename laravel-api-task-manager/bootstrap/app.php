<?php

use App\Http\Middleware\CheckApiKey;
use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => CheckUserRole::class,
        ]);

        $middleware->appendToGroup('api', [
            SetLocale::class,
            TrimStrings::class,
            CheckApiKey::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (NotFoundHttpException $e) {
            return response()->json(
                [
                    'message' => $e->getMessage(),
                    'is_error' => true,
                    'code_status' => Response::HTTP_NOT_FOUND
                ],
                Response::HTTP_NOT_FOUND
            );
        });

        $exceptions->render(function (HttpException $e) {
            return response()->json(
                [
                    'message' => $e->getMessage(),
                    'is_error' => true,
                    'code_status' => $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR
                ],
                $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR
            );
        });
    })->create();
