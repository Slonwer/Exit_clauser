// JavaScript Document

document.addEventListener("DOMContentLoaded", function(event) 
{
	document.getElementById("btnAmpliar").addEventListener("click",clique);	
	$("#btnFecharModal").click(function()
	{
		$("#largeModal").modal("hide");
	});
});

function clique()
{
	// var modalJ = document.getElementById("janelaModal");
	// var modalI = document.getElementById("imgModal");
	// var modalB = document.getElementById("btFechar");
	// var imgPrincipal = document.getElementById("imgPrincipal");				
	// modalJ.style.display = "block";
	// modalI.src = imgPrincipal.getAttribute("src");
	// modalB.onclick = function() {
	// 	modalJ.style.display = "none";
	// }

	$("#md").click();
}

function confirmacaoVenda() {
    var resposta = confirm("RRSECCO diz: Confirma a Compra?");
    if (resposta == true) {
		window.location.href = "mov_venda.php";
    }
}

function confirmacaoExclusao(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_user.php?id=" + id;
    }
}

function confirmacaoExclusaoCategoria(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_categoria.php?id=" + id;
    }
}

function confirmacaoExclusaoProduto(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_produto.php?id=" + id;
    }
}

function confirmacaoExclusaoInformacao(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_informacao.php?id=" + id;
    }
}

function confirmacaoExclusaoEmail(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_email.php?id=" + id;
    }
}

function confirmacaoExclusaoEmpresa(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_empresa.php?id=" + id;
    }
}

function confirmacaoExclusaoFrete(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_frete.php?id=" + id;
    }
}

function confirmacaoExclusaoFavorito(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_favorito.php?id=" + id;
    }
}

function confirmacaoExclusaoColecao(id) {
	var resposta = confirm("Deseja remover esse registro?");
    if (resposta == true) {
		window.location.href = "excluir_colecao.php?id=" + id;
    }
}

function confirmacaoMaletaFechada(id) {
	var resposta = confirm("A Maleta " + id + " já foi feito acerto.\nDeseja visualizar?");
    if (resposta == true) {
		window.location.href = "maleta_visualizar.php?id=" + id + "&origem=sim";
    }
}

function close_window() {
  if (confirm("Deseja sair?")) {
	close();
  }
}

function MensagemContato($e_mail) {
	alert("Fernandes Acessórios: \nObrigado por entra em contato, assim que possível entraremos em contato.\nCaso não receba o e-mail verifique a pasta de Spam/Lixo Eletonico, ou \nEntre em contato:\nFernandes Acessórios\nE-mail: fraan_fer@yahoo.com.br\nTelefone: +55 (18) 98182-9131");
}

function OpcaoMensagens($id) {
	if($id === 1) {
		window.alert('Registro gravado com sucesso!');
	}
	if($id === 2) {
		window.alert('Erro ao salvar o arquivo. Aparentemente voc&ecirc; não tem permissão de escrita.');
	}
	if($id === 3) {
		window.alert('Você poderá enviar apenas arquivos \"*.jpg;*.jpeg;*.gif;*.png\"');
	}
	if($id === 4) {
		window.alert('Registro já cadastrado!');
	}
	if($id === 5) {
		window.alert('Ocorreu um erro!');
	}
	if($id === 6) {
		window.alert('Registro alterado com sucesso!');
	}
	if($id === 7) {
		window.alert('Usuário e/ou senha inválido(s)!');
	}
	if($id === 8) {
		window.alert('Senhas não são iguais!');
	}
	if($id === 9) {
		window.alert('Registro excluido com sucesso!');
	}
	if($id === 10) {
		window.alert('Não existe alunos para a chamada!');
	}
	if($id === 11) {
		window.alert('Estoque de Produtos atualizado!');
	}
	if($id === 12) {
		window.alert('CPF Inválido!');
	}
	if($id === 13) {
		window.alert('CNPJ já Cadastrado!');
	}
	if($id === 14) {
		window.alert('CPF já Cadastrado!');
	}
	if($id === 15) {
		window.alert('Desculpa, não há mais vagas!');
	}
	if($id === 16) {
		window.alert('Registro gravado com sucesso! \nE \nE-mail enviado com Sucesso!');
	}
	if($id === 17) {
		window.alert('E-mail enviado com Sucesso!');
	}
	if($id === 18) {
		window.alert('Atenção!\nPara Imprimir o Certificado, é só clicar as teclas Crtl+p\nSelecione: Layout Paisagem');
	}
	if($id === 19) {
		window.alert('Atenção!\nE-mail não encontrado em nosso cadastro.');
	}
	if($id === 20) {
		window.alert('E-mail inválido!');
	}
	if($id === 21) {
		window.alert('Nome inválido ou E-mail inválido ou Celular inválido!');
	}
	if($id === 22) {
		window.alert('Compra finalizada com sucesso!');
	}
	if($id === 23) {
		window.alert('Produto removido do carrinho, quantidade acima do estoque!');
	}
	if($id === 24) {
		window.alert('PRODUTO NÃO ADICIONADO!\nVocê precisa estar logado em nossa loja, para adicionar\nprodutos aos favoritos.');
	}
	if($id === 25) {
		window.alert('CPF já Cadastrado!');
	}
	if($id === 26) {
		window.alert('E-mail já Cadastrado!');
	}
	if($id === 27) {
		window.alert('E-mail não são iguais!');
	}
	if($id === 28) {
		window.alert('Selecione O STATUS DA INFORMAÇÃO!');
	}
	if($id === 29) {
		window.alert('Empresa já cadastrada, só é possível alterar!');
	}
	if($id === 30) {
		window.alert('Selecione a forma de pagamento!');
	}
	if($id === 31) {
		window.alert('Selecione o frete!');
	}
	if($id === 32) {
		window.alert('Preencha os dados do cartão corretamente!');
	}
	if($id === 33) {
		window.alert('Você precisa estar logado em nossa loja!');
	}
	if($id === 34) {
		window.alert('Produto adicionado aos favoritos!');
	}
	if($id === 35) {
		window.alert('Deverá apenas selecionar um Produto!');
	}
	if($id === 36) {
		window.alert('É necessário selecionar os Produto!');
	}
	if($id === 37) {
		window.alert('CPF ou E-mail não encontrado em nosso cadastro!');
	}
	if($id === 38) {
		window.alert('E-mail enviado com sucesso!\nCaso não receba o e-mail verifique a pasta de Spam/Lixo Eletonico, ou \nEntre em contato com o site.');
	}
	if($id === 39) {
		window.alert('Produto não encontrado!');
	}
	if($id === 40) {
		window.alert('Promoção Inserida ao Produto!');
	}
	if($id === 41) {
		window.alert('Obrigado pela sua avaliação!');
	}
	if($id === 42) {
		window.alert('CEP Inválido!');
	}
	if($id === 43) {
		window.alert('CEP Inválido!');
	}
}

function SessaoExpirada() {
	alert("WebSite diz: \nSua Sessão foi Expirada!");
}