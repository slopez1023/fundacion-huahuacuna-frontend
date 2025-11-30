"use client";

import Image from "next/image";
import Link from "next/link";

/*
  RegistroPage (src/app/registro/page.tsx)

  Propósito:
  - Presentar la pantalla de registro con el formulario completo y elementos visuales.

  Responsabilidad:
  - Componer la vista usando `RegisterForm` y bloques informativos en la columna izquierda.
  - Mantener la página libre de lógica de negocio; el formulario maneja las validaciones y
    delega la creación de usuario al hook `useAuth`.
*/
// Eliminado: El registro de usuario ya no forma parte del proyecto.

export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Página de Registro</h1>
        <p className="text-gray-600 mb-8">Esta sección está disponible próximamente.</p>
        <Link 
          href="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Volver al Login
        </Link>
      </div>
    </main>
  );
}
