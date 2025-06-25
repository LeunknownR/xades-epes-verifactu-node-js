# Xades EPES VeriFactu - Node JS

Implementación de Xades EPES con Node JS.

## Consideración

Colocar los ficheros del certificado `certs/private_key.key` y `certs/public_cert.crt`.

## Ejecución

1. `npm i` Instalar dependencias.

2. `npm start` Generar firma.

## Recursos

* [Especificación de firma electrónica - VeriFactu.](https://www.agenciatributaria.es/static_files/AEAT_Desarrolladores/EEDD/IVA/VERI-FACTU/Espec-Tecnicas/EspecTecGenerFirmaElectRfact.pdf)
* [Política de firma electrónica AGE (en el que se basa VeriFactu).](https://sede.administracion.gob.es/politica_de_firma_anexo_1.pdf)
* [Validador de firmas electrónicas aprobado por la AEAT.](https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/validation)

## Ejemplos

* [Ejemplo](./docs/invoice-signed-sample.xml) de la factura en XML firmada.