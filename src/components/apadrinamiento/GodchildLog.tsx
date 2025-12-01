/**
 * GodchildLog - Bitácora del niño apadrinado (Solo lectura para padrinos)
 * 
 * CORRECCIÓN: El padrino solo puede VER y DESCARGAR la bitácora.
 * Solo el administrador puede agregar entradas.
 * 
 * @author Fundación Huahuacuna
 * @version 2.0 - Solo lectura
 */

"use client";

import { IBitacoraEntrada } from "@/types/apadrinamiento.types";
import { BookOpen, Calendar, Download, FileText } from "lucide-react";
import { useState } from "react";

interface GodchildLogProps {
  entries: IBitacoraEntrada[];
  childName?: string; // Nombre del niño para el PDF
  isLoading?: boolean;
}

export default function GodchildLog({
  entries,
  childName = "mi apadrinado",
  isLoading = false,
}: GodchildLogProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  /**
   * Genera y descarga la bitácora en formato PDF
   * Utiliza la API del navegador para crear un documento imprimible
   */
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Crear contenido HTML para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Bitácora de ${childName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              padding-bottom: 20px;
              border-bottom: 3px solid #1E3A5F;
            }
            .header h1 { 
              color: #1E3A5F; 
              font-size: 28px; 
              margin-bottom: 8px;
            }
            .header p { 
              color: #666; 
              font-size: 14px;
            }
            .logo-text {
              font-size: 12px;
              color: #1E3A5F;
              font-weight: bold;
              margin-top: 10px;
            }
            .entry { 
              margin-bottom: 30px; 
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              background: #fafafa;
              page-break-inside: avoid;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              padding-bottom: 10px;
              border-bottom: 1px solid #e0e0e0;
            }
            .entry h3 { 
              color: #1E3A5F; 
              font-size: 18px;
            }
            .entry-date { 
              color: #666; 
              font-size: 12px;
              background: #e8e8e8;
              padding: 4px 10px;
              border-radius: 12px;
            }
            .entry-content { 
              color: #444;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .entry-author {
              font-size: 11px;
              color: #888;
              text-align: right;
              font-style: italic;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              color: #999; 
              font-size: 11px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
            .no-entries {
              text-align: center;
              padding: 40px;
              color: #666;
            }
            @media print {
              body { padding: 20px; }
              .entry { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📖 Bitácora de ${childName}</h1>
            <p>Fundación Huahuacuna - Programa de Apadrinamiento</p>
            <p class="logo-text">Generado el ${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          ${entries.length === 0 ? `
            <div class="no-entries">
              <p>No hay entradas en la bitácora aún.</p>
            </div>
          ` : entries.map((entry, index) => `
            <div class="entry">
              <div class="entry-header">
                <h3>${index + 1}. ${entry.titulo}</h3>
                <span class="entry-date">${new Date(entry.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <p class="entry-content">${entry.contenido}</p>
              <p class="entry-author">Registrado por: ${entry.registradoPor === 'ADMINISTRADOR' ? 'Administrador' : 'Padrino'}</p>
            </div>
          `).join('')}
          
          <div class="footer">
            <p>Fundación Huahuacuna © ${new Date().getFullYear()}</p>
            <p>Armenia, Quindío - Colombia</p>
            <p>"Cualquiera que reciba en mi nombre a un niño como éste, a mí me recibe…" Mt. 18,5</p>
          </div>
        </body>
        </html>
      `;

      // Crear blob y descargar
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Abrir en nueva ventana para imprimir/guardar como PDF
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        // Fallback: descargar como HTML
        const link = document.createElement('a');
        link.href = url;
        link.download = `Bitacora_${childName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el documento. Por favor intenta de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón de descarga */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1E3A5F]">Bitácora</h3>
            <p className="text-sm text-gray-500">{entries.length} {entries.length === 1 ? 'entrada' : 'entradas'} registradas</p>
          </div>
        </div>
        
        {/* Botón de descarga PDF */}
        {entries.length > 0 && (
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isGeneratingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Descargar PDF
              </>
            )}
          </button>
        )}
      </div>

      {/* Mensaje informativo */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> La bitácora es actualizada periódicamente por el equipo de la fundación 
              con información sobre el progreso y actividades de tu apadrinado.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de entradas */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#1E3A5F] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Cargando bitácora...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">Sin entradas aún</h4>
          <p className="text-gray-500 max-w-md mx-auto">
            El administrador de la fundación agregará entradas con información 
            sobre el progreso y actividades de tu apadrinado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg hover:border-[#1E3A5F]/20 transition-all group"
            >
              {/* Header de la entrada */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#1E3A5F]/10 rounded-lg flex items-center justify-center text-[#1E3A5F] font-bold text-sm flex-shrink-0">
                    {entries.length - index}
                  </div>
                  <h4 className="text-lg font-bold text-[#1E3A5F] group-hover:text-[#2c5282] transition-colors">
                    {entry.titulo}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {new Date(entry.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Contenido */}
              <p className="text-gray-700 leading-relaxed mb-4 pl-11">
                {entry.contenido}
              </p>

              {/* Footer con autor */}
              <div className="flex items-center justify-between pl-11 pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${
                    entry.registradoPor === "ADMINISTRADOR" 
                      ? "bg-blue-500" 
                      : "bg-green-500"
                  }`}></span>
                  Registrado por: {entry.registradoPor === "ADMINISTRADOR" ? "Administrador" : "Padrino"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}