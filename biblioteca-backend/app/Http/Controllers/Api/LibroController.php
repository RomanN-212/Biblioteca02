<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Libro;

class LibroController extends Controller
{
    public function index()
    {
        return Libro::all(); 
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'publicacion' => 'nullable|integer',
            'genero' => 'nullable|string|max:100',
            'disponibilidad' => 'boolean'
        ]);

        $libro = Libro::create([
            'titulo' => $request->titulo,
            'autor' => $request->autor,
            'publicacion' => $request->publicacion,
            'genero' => $request->genero,
            'disponibilidad' => $request->disponibilidad ?? true, 
        ]);
        return response()->json($libro, 201);
    }

    public function show($id)
    {
        return Libro::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $libro = Libro::findOrFail($id);
        
        $request->validate([
            'titulo' => 'string|max:255',
            'autor' => 'string|max:255',
            'publicacion' => 'nullable|integer',
            'genero' => 'nullable|string|max:100',
            'disponibilidad' => 'boolean'
        ]);

        $libro->update($request->all());
        return response()->json($libro, 200);
    }

    public function destroy($id)
    {
        Libro::destroy($id);
        return response()->json(null, 204);
    }
}
