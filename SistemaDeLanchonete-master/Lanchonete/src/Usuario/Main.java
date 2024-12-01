package Usuario;

import Pedido.Cardapio;
import Pedido.ItemCardapio;
import Pedido.Pedido;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Scanner;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        UserAccountManager accountManager = new UserAccountManager();
        AuthenticationService authService = new AuthenticationService(accountManager);
        InputHandler inputHandler = new InputHandler(scanner);
        ExcellDataReader excelDataReader = new ExcellDataReader();
        PagamentoHandler pagamentoHandler = new PagamentoHandler(scanner);

        accountManager.createAccount("admin", "password");

        while (true) {
            inputHandler.showMenu();
            int option = inputHandler.getOption();

            switch (option) {
                case 1:
                    String[] loginDetails = inputHandler.getLoginDetails();
                    if (authService.login(loginDetails[0], loginDetails[1])) {
                        System.out.println("Login bem-sucedido.");

                        System.out.println("Digite 1 para fazer um pedido ou 2 para visualizar seus dados:");
                        int action = scanner.nextInt();
                        scanner.nextLine(); // Consumir a quebra de linha

                        if (action == 1) {
                            Cardapio cardapio = new Cardapio();
                            Pedido pedido = new Pedido(inputHandler);

                            System.out.println("Menu:");
                            for (ItemCardapio item : cardapio.getItens()) {
                                System.out.println(item.getNome() + " - R$ " + item.getPreco());
                            }

                            System.out.println("Digite o nome dos itens que deseja adicionar (ou 'sair' para finalizar):");
                            String itemNome;
                            while (!(itemNome = scanner.nextLine()).equalsIgnoreCase("sair")) {
                                for (ItemCardapio item : cardapio.getItens()) {
                                    if (item.getNome().equalsIgnoreCase(itemNome)) {
                                        pedido.adicionarItem(item);
                                        System.out.println(item.getNome() + " adicionado ao pedido.");
                                    }
                                }
                            }

                            exibirResumoPedido(pedido);

                            String[] userInfo = inputHandler.getUserInfo();
                            try {
                                saveUserDataToExcel(loginDetails[0], loginDetails[1], userInfo, pedido);
                                System.out.println("Informações e pedido salvos com sucesso.");
                            } catch (IOException e) {
                                System.out.println("Erro ao salvar informações: " + e.getMessage());
                            }

                            if (pagamentoHandler.realizarPagamento(pedido)) {
                                System.out.println("Pagamento concluído.");
                            } else {
                                System.out.println("Erro ao realizar o pagamento.");
                            }
                        } else if (action == 2) {
                            try {
                                excelDataReader.displayUserData(loginDetails[0]);
                            } catch (IOException e) {
                                System.out.println("Erro ao exibir dados: " + e.getMessage());
                            }
                        }

                    } else {
                        System.out.println("Nome de usuário ou senha incorretos.");
                    }
                    break;
                case 2:
                    String[] accountDetails = inputHandler.getNewAccountDetails();
                    if (accountManager.createAccount(accountDetails[0], accountDetails[1])) {
                        System.out.println("Conta criada com sucesso.");
                    } else {
                        System.out.println("Nome de usuário já existe.");
                    }
                    break;
                case 3:
                    System.out.println("Saindo...");
                    scanner.close();
                    return;
                default:
                    System.out.println("Opção inválida.");
            }
        }
    }

    public static void exibirResumoPedido(Pedido pedido) {
        System.out.println("Resumo do Pedido:");
        for (ItemCardapio item : pedido.getItens()) {
            System.out.println(item.getNome() + " - R$ " + item.getPreco());
        }
        System.out.println("Total: R$ " + pedido.getTotal());
    }

    public static void saveUserDataToExcel(String username, String password, String[] userInfo, Pedido pedido) throws IOException {
        // Checa se o arquivo já existe
        File file = new File("UserData.xlsx");
        Workbook workbook;
        Sheet sheet;

        if (file.exists()) {
            try (FileInputStream fis = new FileInputStream(file)) {
                workbook = new XSSFWorkbook(fis);
                sheet = workbook.getSheetAt(0);
            }
        } else {
            workbook = new XSSFWorkbook();
            sheet = workbook.createSheet("UserData");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Username", "Password", "Nome", "Telefone", "Endereço", "CPF", "Total Pedido", "Itens Pedidos"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
        }

        int lastRow = sheet.getLastRowNum();
        Row dataRow = sheet.createRow(lastRow + 1);
        dataRow.createCell(0).setCellValue(username);
        dataRow.createCell(1).setCellValue(password);
        dataRow.createCell(2).setCellValue(userInfo[0]);
        dataRow.createCell(3).setCellValue(userInfo[1]);
        dataRow.createCell(4).setCellValue(userInfo[2]);
        dataRow.createCell(5).setCellValue(userInfo[3]);
        dataRow.createCell(6).setCellValue(pedido.getTotal());

        StringBuilder itensPedidos = new StringBuilder();
        for (ItemCardapio item : pedido.getItens()) {
            itensPedidos.append(item.getNome()).append(" (R$ ").append(item.getPreco()).append("), ");
        }

        if (itensPedidos.length() > 0) {
            itensPedidos.setLength(itensPedidos.length() - 2); // Remove a última vírgula e espaço
        }

        dataRow.createCell(7).setCellValue(itensPedidos.toString());

        // Salvar o arquivo
        try (FileOutputStream fileOut = new FileOutputStream(file)) {
            workbook.write(fileOut);
        }

        workbook.close();
    }
}
