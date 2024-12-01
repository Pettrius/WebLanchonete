package Pedido;

import java.util.ArrayList;
import java.util.List;

public class Cardapio {

    private List<ItemCardapio> itens;

        public Cardapio() {
            this.itens = new ArrayList<>();
            this.itens.add(new ItemCardapio("Coxinha", 5.00));
            this.itens.add(new ItemCardapio("Pastel", 6.00));
            this.itens.add(new ItemCardapio("Empada", 4.50));
            this.itens.add(new ItemCardapio("Kibe", 4.00));
            this.itens.add(new ItemCardapio("Cigarrete", 5.50));
            this.itens.add(new ItemCardapio("Coca cola", 3.00));
            this.itens.add(new ItemCardapio("Guaraná", 3.00));
            this.itens.add(new ItemCardapio("Suco", 4.00));
            this.itens.add(new ItemCardapio("Fanta laranja", 3.00));
            this.itens.add(new ItemCardapio("Fanta uva", 3.00));
        }

        public List<ItemCardapio> getItens() {
            return itens;
        }
    }

