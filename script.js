// La función abrirModal(planId, plan, precio) ahora se define directamente
// dentro de planes.php, porque necesita conocer el ID del plan para
// poder procesar la compra. Aquí solo dejamos el manejo de cierre del modal.

document.addEventListener('DOMContentLoaded', function () {
    const cerrar = document.querySelector('.cerrar');
    if (cerrar) {
        cerrar.onclick = function () {
            document.getElementById('modal-compra').style.display = 'none';
        };
    }
});
