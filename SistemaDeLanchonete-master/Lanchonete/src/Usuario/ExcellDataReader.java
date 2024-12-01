package Usuario;


import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class ExcellDataReader {

    public void displayUserData(String username) throws IOException {
        File file = new File("UserData.xlsx");
        if (!file.exists()) {
            System.out.println("Arquivo de dados não encontrado.");
            return;
        }

        try (FileInputStream fileInputStream = new FileInputStream(file);
             Workbook workbook = new XSSFWorkbook(fileInputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            boolean userFound = false;
            for (Row row : sheet) {
                Cell usernameCell = row.getCell(0);
                if (usernameCell != null && usernameCell.getStringCellValue().equals(username)) {
                    System.out.println("Username: " + usernameCell.getStringCellValue());
                    System.out.println("Password: " + row.getCell(1).getStringCellValue());
                    System.out.println("Nome: " + row.getCell(2).getStringCellValue());
                    System.out.println("Telefone: " + row.getCell(3).getStringCellValue());
                    System.out.println("Endereço: " + row.getCell(4).getStringCellValue());
                    System.out.println("CPF: " + row.getCell(5).getStringCellValue());
                    System.out.println("Total Pedido: " + row.getCell(6).getNumericCellValue());
                    userFound = true;
                    break;
                }
            }

            if (!userFound) {
                System.out.println("Usuário não encontrado.");
            }

        } catch (IOException e) {
            throw new IOException("Erro ao ler o arquivo: " + e.getMessage());
        }
    }
}
