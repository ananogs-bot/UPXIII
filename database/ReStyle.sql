DROP DATABASE IF EXISTS RESTYLE;
CREATE DATABASE RESTYLE;
USE RESTYLE;

-- Tabela de usuários com UUID
CREATE TABLE USUARIO (
    cod_usuario CHAR(36) PRIMARY KEY,
    nome_usuario VARCHAR(50) NOT NULL,
    email_usuario VARCHAR(30) NOT NULL UNIQUE,
    senha_usuario VARCHAR(100) NOT NULL
);

-- Tabela de vestuários com UUID
CREATE TABLE VESTUARIO(
    cod_vestuario CHAR(36) PRIMARY KEY,
    nome_vestuario VARCHAR(30) NOT NULL,
    url_vestuario VARCHAR(300) NOT NULL,
    descricao_vestuario VARCHAR(500) NOT NULL,
    valor_vestuario INT NOT NULL,
    cor_vestuario VARCHAR(20) NOT NULL,
    tamanho_vestuario VARCHAR(5) NOT NULL
);

-- Tabela de formas de pagamento (mantém ID numérico auto_increment)
CREATE TABLE PAGAMENTO(
    cod_pagamento INT PRIMARY KEY AUTO_INCREMENT,
    nome_pagamento VARCHAR(20) NOT NULL
);

-- Tabela de aluguéis com relacionamentos via UUID
CREATE TABLE ALUGUEL (
    cod_aluguel INT PRIMARY KEY AUTO_INCREMENT,
    cod_usuario CHAR(36),
    cod_vestuario CHAR(36),
    data_aluguel DATE NOT NULL,
    cod_pagamento INT,
    FOREIGN KEY(cod_usuario) REFERENCES USUARIO(cod_usuario),
    FOREIGN KEY(cod_vestuario) REFERENCES VESTUARIO(cod_vestuario),
    FOREIGN KEY(cod_pagamento) REFERENCES PAGAMENTO(cod_pagamento)
);

-- Inserindo os meios de pagamento
INSERT INTO PAGAMENTO(nome_pagamento) VALUES 
('débito'),
('crédito'),
('pix');


INSERT INTO VESTUARIO
	(cod_vestuario, nome_vestuario, url_vestuario, descricao_vestuario, valor_vestuario, cor_vestuario, tamanho_vestuario) 
VALUES
	(UUID(), 'Vestido Casual', 'assets/img/mulher-falando-ao-telefone-ao-ar-livre.jpg', 'Vestido casual em tom vinho, confeccionado em tecido leve e confortável, ideal para o dia a dia ou encontros informais. Possui corte fluido que valoriza a silhueta, com detalhes sutis como decote em V e mangas curtas, perfeito para quem busca estilo com conforto. Fácil de combinar e usar em diversas ocasiões, trazendo elegância descomplicada ao seu guarda-roupa.', 120, 'vinho', 'G'),
	(UUID(), 'Vestido Formal', 'assets/img/retrato-da-moda-da-jovem-mulher-elegante.jpg', 'Vestido formal em cetim verde esmeralda, com acabamento suave e brilho sofisticado. Design elegante com corte ajustado ao corpo, decote delicado e comprimento midi, ideal para eventos especiais e ocasiões sofisticadas. Um toque de luxo e charme para quem quer impressionar com estilo e elegância.', 150, 'verde esmeralda', 'P'),
    (UUID(), 'Vestido Casual', 'assets/img/mulher-sorridente-de-vista-lateral-posando-com-bolsa.jpg', 'Vestido branco leve e fluido, perfeito para um visual praiano e descontraído. Feito com tecido fresco e respirável, ideal para dias ensolarados à beira-mar. Com detalhes delicados como alças finas e acabamento em renda, traz conforto e estilo casual para passeios e momentos relaxantes.', 100, 'branco', 'PP'),
	(UUID(), 'Macacão Formal','assets/img/mulher-bonita-vestindo-um-terno-preto-coque-de-cabelo-maquiagem-sorrindo-posando-em-pe-perto-dos-portoes-ao-ar-livre-mao-na-cintura-olhando-para-baixo-elegante-moda.jpg', 'Vestido branco leve e fluido, perfeito para um visual praiano e descontraído. Feito com tecido fresco e respirável, ideal para dias ensolarados à beira-mar. Com detalhes delicados como alças finas e acabamento em renda, traz conforto e estilo casual para passeios e momentos relaxantes.', 100, 'branco', 'M');


SELECT * from VESTUARIO;
SELECT * from PAGAMENTO;
SELECT * from ALUGUEL;