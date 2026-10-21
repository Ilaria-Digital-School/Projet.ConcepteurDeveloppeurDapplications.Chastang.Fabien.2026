<?php

use App\Http\Middleware\CheckApiKey;
use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\SetLocale;
use App\Utilities\RenderJson;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\LockedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

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
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (BadRequestHttpException $e) {
            return RenderJson::jsonError($e->getMessage(), Response::HTTP_BAD_REQUEST);
        });
        $exceptions->render(function (UnauthorizedHttpException $e) {
            return RenderJson::jsonError($e->getMessage(), Response::HTTP_UNAUTHORIZED);
        });
        $exceptions->render(function (AuthorizationException $e) {
            return RenderJson::jsonError($e->getMessage(), Response::HTTP_FORBIDDEN);
        });
        $exceptions->render(function (NotFoundHttpException $e) {
            return RenderJson::jsonError($e->getMessage(), Response::HTTP_NOT_FOUND);
        });
        $exceptions->render(function (MethodNotAllowedHttpException $e) {
            return RenderJson::jsonError($e->getMessage(), Response::HTTP_METHOD_NOT_ALLOWED);
        });
        $exceptions->render(function (UnprocessableEntityHttpException $e) {
            return RenderJson::jsonError($e->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        });
        $exceptions->render(function (LockedHttpException $e) {
            return RenderJson::jsonError($e->getMessage(), Response::HTTP_LOCKED);
        });
        $exceptions->render(function (HttpException $e) {
            return RenderJson::jsonError($e->getMessage(), $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        });
    })->create();
