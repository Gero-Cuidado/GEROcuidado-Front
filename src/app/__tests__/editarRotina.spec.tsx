// import React from "react";
// import { render, fireEvent, waitFor, act, screen } from "@testing-library/react-native";
// import EditarRotina from "../private/pages/editarRotina";
// import { useLocalSearchParams } from 'expo-router';


// // Pending correction
// describe("EditarRotina Component", () => {
//   it("Does nothing", async () => {
//     // ...
//   });

  // it("Salvar sem título", async () => {
  //   const { getByText, getByPlaceholderText, getByTestId } = render(
  //     <EditarRotina />
  //   );

  //   const titulo = getByPlaceholderText("Adicionar título");
  //   const salvar = getByText("Salvar");

  //   await act(async () => {
  //     fireEvent.changeText(titulo, "");
  //     fireEvent.press(salvar);
  //   });

  //   await waitFor(() => {
  //     const erroTitulo = getByTestId("Erro-titulo");
  //     expect(erroTitulo.props.children.props.text).toBe("Campo obrigatório!");
  //   });
  // });

  // it("Salvar com título muito grande", async () => {
  //   const { getByText, getByPlaceholderText } = render(<EditarRotina />);

  //   const titulo = getByPlaceholderText("Adicionar título");
  //   const salvar = getByText("Salvar");

  //   await act(async () => {
  //     fireEvent.changeText(
  //       titulo,
  //       "Por que o livro de matemática está sempre triste? Porque tem muitos problemas! hahahahahahhahahahahhahahaahahahahahahhahahahahahahahahahahahhahaahahahahahahahahah"
  //     );
  //     fireEvent.press(salvar);
  //   });

  //   await waitFor(() => {
  //     const erroTitulo = getByText(
  //       "O título deve ter no máximo 100 caractéres."
  //     );
  //     expect(erroTitulo).toBeTruthy();
  //   });
  // });

  // it("Salvar data com formato errado", async () => {
  //   const { getByText, getByPlaceholderText, getByTestId } = render(
  //     <EditarRotina />
  //   );

  //   const data = getByPlaceholderText("Data da rotina");
  //   const salvar = getByText("Salvar");

  //   await act(async () => {
  //     fireEvent.changeText(data, "2010");
  //     fireEvent.press(salvar);
  //   });

  //   await waitFor(() => {
  //     const erroData = getByTestId("Erro-data");
  //     expect(erroData.props.children.props.text).toBe(
  //       "Data deve ser no formato dd/mm/yyyy!"
  //     );
  //   });
  // });

  // it("Salvar sem hora", async () => {
  //   const { getByText, getByPlaceholderText, getByTestId } = render(
  //     <EditarRotina />
  //   );

  //   const hora = getByPlaceholderText("Horário de início");
  //   const salvar = getByText("Salvar");

  //   await act(async () => {
  //     fireEvent.changeText(hora, "");
  //     fireEvent.press(salvar);
  //   });

  //   await waitFor(() => {
  //     const erroHora = getByTestId("Erro-hora");
  //     expect(erroHora.props.children.props.text).toBe("Campo obrigatório");
  //   });
  // });

  // it("Salvar hora com formato errado", async () => {
  //   const { getByText, getByPlaceholderText, getByTestId } = render(
  //     <EditarRotina />
  //   );

  //   const hora = getByPlaceholderText("Horário de início");
  //   const salvar = getByText("Salvar");

  //   await act(async () => {
  //     fireEvent.changeText(hora, "201");
  //     fireEvent.press(salvar);
  //   });

  //   await waitFor(() => {
  //     const erroHora = getByTestId("Erro-hora");
  //     expect(erroHora.props.children.props.text).toBe(
  //       "Hora deve ser no formato hh:mm!"
  //     );
  //   });
  // });

  // it("Salvar com descrição muito grande", async () => {
  //   const { getByText, getByPlaceholderText } = render(<EditarRotina />);

  //   const descricao = getByPlaceholderText("Descrição");
  //   const salvar = getByText("Salvar");

  //   await act(async () => {
  //     fireEvent.changeText(
  //       descricao,
  //       "Num universo vasto e misterioso, onde galáxias dançam em uma sinfonia cósmica, a teia da existência se entrelaça, conectando cada átomo e cada pensamento em uma tapeçaria intricada de tempo e espaço; neste intricado emaranhado, as histórias dos indivíduos se entrelaçam, tecendo um tecido social complexo onde sonhos se desdobram e destinos se entrelaçam, criando uma narrativa épica que transcende as fronteiras do tempo, desafiando a compreensão humana e convidando-nos a contemplar a beleza efêmera da vida, como se fôssemos observadores temporários de um espetáculo cósmico em constante evolução, onde cada escolha, cada suspiro, ecoa através das eras, deixando uma marca indelével na vastidão do infinito."
  //     );
  //     fireEvent.press(salvar);
  //   });

  //   await waitFor(() => {
  //     const erroDescricao = getByText(
  //       "A descrição deve ter no máximo 300 caracteres."
  //     );
  //     expect(erroDescricao).toBeTruthy();
  //   });
  // });
// });


import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import EditarRotina from "../private/pages/editarRotina";
import { useLocalSearchParams } from 'expo-router';
import * as Notifications from 'expo-notifications';
jest.mock('expo-notifications', () => require("../../../__mocks__/expo-notifications"));

// Mock para useLocalSearchParams
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(),
}));

// Mock para expo-notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'mockToken' }),
  setNotificationChannelAsync: jest.fn(),
}));


describe("EditarRotina Component", () => {
  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      rotina: JSON.stringify({
        titulo: 'Rotina Teste',
        descricao: 'Descrição Teste',
        categoria: 'GERAL',
        dias: [1, 2, 3],
        dataHora: new Date().toISOString(),
        notificacao: 'true',
        token: 'mockToken',
      }),
    });
  });

  test('deve renderizar todos os componentes', () => {
    render(<EditarRotina />);
    
    // Verifica se o título está sendo exibido
    expect(screen.getByText('Detalhes da rotina')).toBeTruthy();
    
    // Verifica se os campos estão sendo renderizados
    expect(screen.getByPlaceholderText('Adicionar título')).toBeTruthy();
    expect(screen.getByPlaceholderText('Data da rotina')).toBeTruthy();
    expect(screen.getByPlaceholderText('Horário de início')).toBeTruthy();
    expect(screen.getByPlaceholderText('Descrição')).toBeTruthy();
    
    // Verifica se o botão de salvar está presente
    expect(screen.getByText('Salvar')).toBeTruthy();
    
    // Verifica se o botão para apagar rotina está presente
    expect(screen.getByText('Apagar Rotina')).toBeTruthy();
  });

  test('deve atualizar os valores dos inputs corretamente', () => {
    render(<EditarRotina />);
  
    // Atualiza o título
    fireEvent.changeText(screen.getByPlaceholderText('Adicionar título'), 'Novo Título');
    expect(screen.getByPlaceholderText('Adicionar título').props.value).toBe('Novo Título');
  
    // Atualiza a data
    fireEvent.changeText(screen.getByPlaceholderText('Data da rotina'), '20/09/2024');
    expect(screen.getByPlaceholderText('Data da rotina').props.value).toBe('20/09/2024');
  
    // Atualiza a hora
    fireEvent.changeText(screen.getByPlaceholderText('Horário de início'), '10:00');
    expect(screen.getByPlaceholderText('Horário de início').props.value).toBe('10:00');
  
    // Atualiza a descrição
    fireEvent.changeText(screen.getByPlaceholderText('Descrição'), 'Nova Descrição');
    expect(screen.getByPlaceholderText('Descrição').props.value).toBe('Nova Descrição');
  });
});
