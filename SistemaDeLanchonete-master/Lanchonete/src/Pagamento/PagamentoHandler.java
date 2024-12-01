package Usuario;

import Pedido.Pedido;

import java.util.Scanner;

public class PagamentoHandler {
    private Scanner scanner;

    public PagamentoHandler(Scanner scanner) {
        this.scanner = scanner;
    }

    public boolean realizarPagamento(Pedido pedido) {
        if (pedido.getTotal() <= 0) {
            System.out.println("Não há itens no pedido para pagamento.");
            return false;
        }

        System.out.println("Escolha o método de pagamento:");
        System.out.println("1. Pix");
        System.out.println("2. Cartão de Crédito");
        System.out.println("3. Cartão de Débito");

        int opcaoPagamento = scanner.nextInt();
        scanner.nextLine();

        switch (opcaoPagamento) {
            case 1:
                System.out.println("Pagamento via Pix realizado com sucesso. Total: R$ " + pedido.getTotal());
                break;
            case 2:
                System.out.println("Pagamento via Cartão de Crédito realizado com sucesso. Total: R$ " + pedido.getTotal());
                break;
            case 3:
                System.out.println("Pagamento via Cartão de Débito realizado com sucesso. Total: R$ " + pedido.getTotal());
                break;
            default:
                System.out.println("Método de pagamento inválido.");
                return false;
        }

        return true;
    }
}
