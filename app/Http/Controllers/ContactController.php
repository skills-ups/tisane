<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function addContact(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required',
            'sujet' => 'required',
            'message' => 'required',
            'email' => ['required', 'email']
        ]);

        Contact::contact($data['nom'], $data['email'], $data['sujet'], $data['message']);
    }
    public function answerContact(Request $request, $id)
    {
        $data = $request->validate([
            'reponse' => 'required',
            'type' => 'nullable'
        ]);
        if ($request->has('type')) {
            $data['type'] = $request->input('type');
        } else {
            $data['type'] = 'general';
        }

        Contact::answers($id, $data['reponse'], $data['type']);
    }
    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();
    }
}
