$(function () {

    $('.remover').click(function (e) {
        e.preventDefault();

        let id = $(this).data('id');
        let name = $(this).data('name');

        // alert(`ID: ${id}, Produto: ${name}`);
        Swal.fire({
            title: `Deseja excluir o produto ${name}?`,
            text: "Ao excluir o produto, esta ação não poderá ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {

            if (result.isConfirmed) {

                try {
                    const response = await fetch(`/produtos/${id}/remover`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log(response);

                    if (!response.ok) {
                        alert('RETORNO', response.status)
                    }

                    Swal.fire({
                        title: "Excluído!",
                        text: `O produto ${name} foi excluído.`,
                        icon: "success",
                        timer: "5000",
                        willClose: () => {
                            location.reload();
                          }
                    })

                } catch (error) {
                    console.log(error);
                }


            }

        });
    });

});