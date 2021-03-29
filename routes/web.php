<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\PageController;


Route::get('/', [PageController::class, 'welcome'])->name('welcome');

Route::group(['middleware' => ['auth:sanctum', 'verified']], function(){
    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');
});
