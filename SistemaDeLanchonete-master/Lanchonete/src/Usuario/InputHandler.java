package Usuario;

import java.util.Scanner;

public class InputHandler {

    private Scanner scanner;

    public InputHandler(Scanner scanner) {
        this.scanner = scanner;
    }

    public void showMenu() {
        System.out.println("\n1. Login");
        System.out.println("2. Criar nova conta");
        System.out.println("3. Sair");
        System.out.print("Escolha uma opção: ");
    }

    public int getOption() {
        return scanner.nextInt();
    }

    public String[] getLoginDetails() {
        scanner.nextLine();
        System.out.print("Digite o nome de usuário: ");
        String username = scanner.nextLine();
        System.out.print("Digite a senha: ");
        String password = scanner.nextLine();
        return new String[]{username, password};
    }

    public String[] getNewAccountDetails() {
        scanner.nextLine();
        System.out.print("Digite o novo nome de usuário: ");
        String username = scanner.nextLine();
        System.out.print("Digite a nova senha: ");
        String password = scanner.nextLine();
        return new String[]{username, password};
    }

    public String[] getUserInfo() {
        System.out.print("Digite o seu nome: ");
        String name = scanner.nextLine();
        System.out.print("Digite o seu telefone: ");
        String phone = scanner.nextLine();
        System.out.print("Digite o seu endereço: ");
        String address = scanner.nextLine();
        System.out.print("Digite o seu CPF: ");
        String cpf = scanner.nextLine();
        return new String[]{name, phone, address, cpf};
    }
}