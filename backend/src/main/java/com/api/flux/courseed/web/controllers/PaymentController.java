package com.api.flux.courseed.web.controllers;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;

public class PaymentController {
    public Mono<ServerResponse> confirmPayment(ServerRequest request) {
        return request.formData()
            .flatMap(formData -> {
                String statePol = formData.getFirst("state_pol"); // ✅ Usa `state_pol`
                String referenceCode = formData.getFirst("reference_sale"); // ✅ Nombre correcto
                String transactionId = formData.getFirst("transaction_id");

                if ("4".equals(statePol)) { // 4 = Pago aprobado ✅
                    System.out.println("✅ Pago aprobado. Ref: " + referenceCode + " - Transacción: " + transactionId);
                } else if ("6".equals(statePol)) { // 6 = Pago rechazado ❌
                    System.out.println("❌ Pago rechazado. Ref: " + referenceCode);
                } else if ("7".equals(statePol)) { // 7 = Pendiente ⏳
                    System.out.println("⏳ Pago pendiente. Ref: " + referenceCode);
                } else {
                    System.out.println("⚠ Estado desconocido: " + statePol);
                }

                return ServerResponse.ok().bodyValue("OK");
            });
    }
}
