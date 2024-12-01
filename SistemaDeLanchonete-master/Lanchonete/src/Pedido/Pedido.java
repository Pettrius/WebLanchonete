package Pedido;

import Usuario.InputHandler;

import java.util.ArrayList;
import java.util.List;

public class Pedido {
    public InputHandler inputHandler;
    public List<ItemCardapio> itens;
    public double total;

    public Pedido(InputHandler inputHandler) {
        this.inputHandler = inputHandler;
        this.itens = new ArrayList<>();
        this.total = 0.0;
    }

    public void adicionarItem(ItemCardapio item) {
        this.itens.add(item);
        this.total += item.getPreco();
    }

    public InputHandler getUsuario() { return inputHandler; }
    public List<ItemCardapio> getItens() { return itens; }
    public double getTotal() { return total; }
}
