<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function authuser()
    {
        return User::where('id', Auth::user()->id)->get();
    }

    public function makepost(Request $req)
    {
        $req->validate([
            'post' => 'required'
        ]);

        $postbyid = Auth::user()->id;
        $postby = Auth::user()->name . ' ' . Auth::user()->surname;
        $post = $req->post;
        $postdata = array('postbyid' => $postbyid, 'postby' => $postby, 'post' => $post);
        Post::insert($postdata);

        if ($req->hasFile('gallery')) {
            $postid = DB::table('posts')->orderBy('id', 'desc')->limit(1)->pluck('id')->first();
            foreach ($req->file('gallery') as $file) {
                $filename = "WORLDREMO_" . date('YmdHis') . rand(0, 9999999) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path("images"), $filename);
                $gallerydata = array('postid' => $postid, 'name' => $filename, 'type' => $file->getClientOriginalExtension());
                Gallery::insert($gallerydata);
            }
        }
    }

    public function posts()
    {
        return Post::orderBy('id', 'desc')->get();
    }

    public function gallery()
    {
        return Gallery::orderBy('id', 'asc')->get();
    }

    public function deletepost(Request $req)
    {
        $req->validate([
            'id' => 'required'
        ]);

        Post::where('id', $req->id)->delete();
        $gallerynames = DB::table('galleries')->where('postid', $req->id)->pluck('name');

        if ($gallerynames->isNotEmpty()) {
            foreach ($gallerynames as $name) {
                if (is_file(public_path("images/" . $name))) {
                    unlink(public_path("images/" . $name));
                }
            }
            Gallery::where('postid', $req->id)->delete();
        }
    }
}
