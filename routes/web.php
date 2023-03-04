<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Auth::routes();

Route::get('/authuser', [HomeController::class, 'authuser'])->name('authuser');
Route::post('/makepost', [HomeController::class, 'makepost'])->name('makepost');
Route::get('/posts', [HomeController::class, 'posts'])->name('posts');
Route::get('/files', [HomeController::class, 'gallery'])->name('gallery');
Route::post('/deletepost', [HomeController::class, 'deletepost'])->name('deletepost');
Route::get('/{path?}', [HomeController::class, 'index'])->name('home');
