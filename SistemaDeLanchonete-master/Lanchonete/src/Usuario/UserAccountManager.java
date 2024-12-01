package Usuario;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;

public class UserAccountManager {
    private HashMap<String, String> accounts = new HashMap<>();
    private static final String FILE_NAME = "usuarios.xlsx";

    public UserAccountManager() {
        loadAccountsFromExcel();
    }

    public boolean createAccount(String username, String password) {
        if (accounts.containsKey(username)) {
            return false;
        }
        accounts.put(username, password);
        saveAccountToExcel(username, password);
        return true;
    }

    public boolean isValidAccount(String username, String password) {
        return accounts.containsKey(username) && accounts.get(username).equals(password);
    }

    private void loadAccountsFromExcel() {
        try (FileInputStream file = new FileInputStream(new File(FILE_NAME));
             Workbook workbook = new XSSFWorkbook(file)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                Cell usernameCell = row.getCell(0);
                Cell passwordCell = row.getCell(1);
                if (usernameCell != null && passwordCell != null) {
                    String username = usernameCell.getStringCellValue();
                    String password = passwordCell.getStringCellValue();
                    accounts.put(username, password);
                }
            }
        } catch (IOException e) {
            System.out.println("Erro ao carregar os dados do arquivo Excel: " + e.getMessage());
        }
    }

    private void saveAccountToExcel(String username, String password) {
        try (FileInputStream file = new FileInputStream(new File(FILE_NAME));
             Workbook workbook = new XSSFWorkbook(file)) {

            Sheet sheet = workbook.getSheetAt(0);
            int rowNum = sheet.getLastRowNum() + 1;
            Row row = sheet.createRow(rowNum);

            Cell usernameCell = row.createCell(0);
            usernameCell.setCellValue(username);

            Cell passwordCell = row.createCell(1);
            passwordCell.setCellValue(password);

            try (FileOutputStream outFile = new FileOutputStream(new File(FILE_NAME))) {
                workbook.write(outFile);
            }
        } catch (IOException e) {
            System.out.println("Erro ao salvar os dados no arquivo Excel: " + e.getMessage());
        }
    }

    public void initializeExcelFile() {
        File file = new File(FILE_NAME);
        if (!file.exists()) {
            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("Usuários");
                try (FileOutputStream fileOut = new FileOutputStream(FILE_NAME)) {
                    workbook.write(fileOut);
                }
            } catch (IOException e) {
                System.out.println("Erro ao criar o arquivo Excel: " + e.getMessage());
            }
        }
    }
}