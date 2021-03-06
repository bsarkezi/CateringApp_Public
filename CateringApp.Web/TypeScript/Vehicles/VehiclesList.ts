﻿module Vehicles {

    let $table: DataTables.Api;
    let $vehicleId: number = 0;

    export function initialize() {
        loader(true);

        $("#form").validate({
            errorPlacement: (label, element) => {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid")
            },
            wrapper:"div"
        });

        document.getElementById("form").addEventListener("submit", handleSubmitForm);

        $table = $("#vehicles-list-table").DataTable({
            columns: [
                {
                    title: "Row num.",
                    data: "vehicleId",
                    width: "10%"
                },
                {
                    title: "Vehicle name",
                    data: "vehicleName"
                },
                {
                    title: "Registration",
                    data: "vehicleRegistration"
                },
                {
                    title: "Odometer value (KM)",
                    data:"vehicleKilometers"
                },
                {
                    title: "Actions",
                    data: "vehicleId",
                    className: "dt-center",
                    width:"20%",
                    render: (colData, data, row: Models.IVehicle) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" onclick=Vehicles.editVehicle(${row.vehicleId})><i class="fas fa-edit" ></i></button><button class="btn btn-danger" alt="Obriši" onclick="Vehicles.deleteVehiclePrompt(${row.vehicleId})"><i class="fas fa-trash-alt"></i></button>`;
                    }
                }
            ],
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            },
        });

        //Row numbers
        $table.on('order.dt search.dt', function () {
            $table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        initData();
    }

    export function initData() {
        console.log("Init data");
        loader(true);
        $("#vehicle-name").val("");
        $("#vehicle-registration").val("");
        $("#vehicle-kilometers").val("");
        $.ajax({
            url: "/api/vehicles",
            contentType: "application/json",
            method: "get",
            success: (data: Models.IVehicle[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();

                $("#vehicle-name").val("");
                $("#vehicle-registration").val("");
                $("#vehicle-kilometers").val("");

                loader(false);
                $vehicleId = 0;
            }
        })
    }

    export function editVehicle(vehicleId: number) {
        console.log("edit vehicle");
        $vehicleId = vehicleId;
        $.ajax({
            url: `/api/vehicles/${vehicleId}`,
            contentType: "application/json",
            method: "get",
            success: (data: Models.IVehicle) => {
                $("#add-vehicle-modal").modal("show");
                $("#vehicle-name").val(data.vehicleName);
                $("#vehicle-registration").val(data.vehicleRegistration);
                $("#vehicle-kilometers").val(data.vehicleKilometers);
            }
        })
    }

    function handleSubmitForm(event: Event){
        event.preventDefault();
        if ($("#form").valid()) {
            submitVehicle();
        }
    }
  
    export function submitVehicle() {
        let vehicle: Models.IVehicle = {
            vehicleId: $vehicleId,
            vehicleRegistration: $("#vehicle-registration").val().toString(),
            vehicleKilometers: parseFloat($("#vehicle-kilometers").val().toString()),
            vehicleName: $("#vehicle-name").val().toString()
        };

        if (vehicle.vehicleName != "") {
            let submissionUrl: string;
            let method: string;


            if ($vehicleId == 0) {
                submissionUrl = `/api/vehicles`;
                method = "post";
            }
            else {
                submissionUrl = `/api/vehicles/${$vehicleId}`;
                method = "put";
            }
            loader(true);
            $.ajax({
                url: submissionUrl,
                method: method,
                contentType: "application/json",
                data: JSON.stringify(vehicle),
                success: () => {
                    $("#add-vehicle-modal").modal("hide");
                    initData();
                    toastr["success"]("Saved successfully!");
                }
            });
        }
    }

    export function deleteVehiclePrompt(vehicleId: number) {
        $vehicleId = vehicleId;
        $("#delete-vehicle-modal").modal("show");
    }

    export function deleteVehicleConfirm() {
        if ($vehicleId !== 0) {
            loader(true);
            $.ajax({
                url: `/api/vehicles/${$vehicleId}`,
                method: "delete",
                success: () => {
                    $("#delete-vehicle-modal").modal("hide");
                    initData();
                    toastr["info"]("Vehicle deleted.");
                },
                error: Global.ajaxErrorHandler
            })
        }
    }

    export function clearForm() {
        let form = <HTMLFormElement>document.getElementById("form");
        form.reset();
        $vehicleId = 0;
    }
}