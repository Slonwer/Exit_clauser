<?php
    /*
    require_once '../dompdf/autoload.inc.php';
    use Dompdf\Dompdf;
    use Dompdf\Options;
    
    $options = new Options();
    $options->setChroot(__DIR__); 
    $options->setIsRemoteEnabled(true);
    $dompdf = new Dompdf($options);
    $dompdf->loadHtmlFile(__DIR__.'/modelo.html');
    $dompdf->setPaper('A4', 'landscape');
    $dompdf->render();
    header('Content-type: application/pdf');
    echo $dompdf->output();*/

    include_once("../conexao.php");
    $result_emp = "SELECT * FROM empresa";	
    $resultado_emp = mysqli_query($conn, $result_emp);
    $row_emp = mysqli_fetch_assoc($resultado_emp);
    $emp_nome = $row_emp['emp_nome'];
    $emp_cnpj = $row_emp['emp_cnpj'];
    $emp_endereco = $row_emp['emp_endereco'];
    $emp_bairro = $row_emp['emp_bairro'];
    $emp_numero = $row_emp['emp_numero'];
    $emp_cidade = $row_emp['emp_cidade'];
    $emp_estado = $row_emp['emp_estado'];
    $emp_telefone = $row_emp['emp_telefone'];
    $emp_celular = $row_emp['emp_celular'];
    $emp_email = $row_emp['emp_email'];
    $img_nome = $row_emp['img_nome'];

    $dataHoje = date("Y-m-d H:i:s");
    $dataFormatada = date_format(date_create(date($dataHoje)), 'd/m/Y');

    /* DADOS DO RELATÓRIO DOBANCO DE DADOS */
    if (isset($_GET['id'])) {
        $codFltro = $_GET['id'];
        $query = "select m.*, u.* from maleta m, usuarios u where m.idmaleta = $codFltro and m.idusuario = u.idusuario order by m.ma_nro";
    } else {
        $query = "select m.*, u.* from maleta m, usuarios u where m.idusuario = u.idusuario order by m.ma_nro";
    }
    $dados = mysqli_query($conn, $query);
    $somaVendido = 0;
    $somaPago = 0;
    $somaLucro = 0;
    $somaTotal = 0;
    $somaSobraTotal = 0;
    $somaParaAcerto = 0;

    $html = '<div class="container-fluid">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <div class="table-responsive">
                            <div class="form-group col-md-12">
                                <div class="col-lg-2 mb-2">
                                    <hr>
                                    <table class="table table-striped table-bordered table-hover" style="font-size:12px;">
                                        <tr>
                                            <td rowspan="5">';
                                                $html .= "<img class='img-profile rounded-circle' src='../img/logo.png' width='100pt' height='100pt'/>";
                                    $html .='</td>
                                            <td>'.$emp_nome.'</td>
                                        </tr>
                                        <tr>
                                            <td>'.$emp_cnpj.'</td>
                                        </tr>
                                        <tr>
                                            <td>'.$emp_endereco.', '.$emp_numero.' - '.$emp_bairro.' - '.$emp_cidade.' / '.$emp_estado.'</td>
                                        </tr>
                                        <tr>
                                            <td>'.$emp_celular.'</td>
                                        </tr>
                                        <tr>
                                            <td>'.$emp_email.'</td>
                                        </tr>
                                    </table>
                                    <hr>
                                </div>                                
                            </div>
                            <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0" border="1">
                                <thead>
                                    <tr style="font-size:14pt; background-color:#fbbc04;">
                                        <th colspan="9">'.$emp_nome.'</th>
                                        <th style="text-align:right;">'.$dataFormatada.'</th>
                                    </tr>
                                    <tr style="font-size:14pt">
                                        <th colspan="10" style="background-color:#00ffff; text-align:center;">BIJOUX FINAS</th>
                                    </tr>
                                    <tr style="font-size:12px; background-color:#ffff00;">
                                        <th style="text-align:center;">Maletas</th>
                                        <th>Vendedores</th>
                                        <th style="text-align:center;">Data da Entrega</th>
                                        <th style="text-align:center;">Data do Acerto</th>
                                        <th style="text-align:right;">Total por Maleta</th>
                                        <th style="text-align:right;">Valor Vendido</th>
                                        <th style="text-align:right;">Valor da Sobra</th>
                                        <th style="text-align:right;">Valor do Revendedor</th>
                                        <th style="text-align:right;">Lucro</th>
                                        <th style="text-align:center;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>';
                                    while ($row_m = mysqli_fetch_assoc($dados)) {
                                        $html .= '<tr style="font-size:10px;">';
                                        $html .= '<td style="text-align:center;">Nº '.$row_m['ma_nro'].'</td>';
                                        $html .= '<td>'.$row_m['nome'].'</td>';
                                        $html .= '<td style="text-align:center;">'.date_format(date_create($row_m['ma_dtainicial']), 'd/m/Y').'</td>';
                                        $html .= '<td style="text-align:center;">'.date_format(date_create($row_m['ma_dtafinal']), 'd/m/Y').'</td>';
                                        $html .= '<td style="text-align:right;">R$ '.number_format($row_m['ma_valortotal'], 2, ',', '.').'</td>';
                                        $html .= '<td style="text-align:right;">R$ '.number_format($row_m['ma_valorvendido'], 2, ',', '.').'</td>';
                                        $html .= '<td style="text-align:right;">R$ '. number_format(($row_m['ma_valortotal'] - $row_m['ma_valorvendido']), 2, ',', '.').'</td>';
                                        $html .= ''.$somaSobraTotal += $row_m['ma_valortotal'] - $row_m['ma_valorvendido'].'';
                                        $html .= '<td style="text-align:right;">R$ '.number_format((($row_m['ma_comissao'] / 100) * $row_m['ma_valorvendido']), 2, ',', '.').'</td>';
                                        $html .= ''.$somaPago += (($row_m['ma_comissao'] / 100) * $row_m['ma_valorvendido']).'';
                                        $html .= '<td style="text-align:right;">R$ '.number_format(($row_m['ma_valorvendido'] - ($row_m['ma_comissao'] / 100) * $row_m['ma_valorvendido']), 2, ',', '.').'</td>';
                                        $html .= ''.$somaLucro += ($row_m['ma_valorvendido'] - ($row_m['ma_comissao'] / 100) * $row_m['ma_valorvendido']).'';
                                        if ($row_m['ma_status'] == 0) {
                                            $html .= '<th style="text-align:center; color:green;">EM ABERTO</th>';
                                        } else {
                                            $html .= '<th style="text-align:center; color:red;">FEITO ACERTO</th>';
                                        }
                                        $html .= '</tr>';
                                        $somaVendido += $row_m['ma_valorvendido'];
                                        $somaTotal += $row_m['ma_valortotal'];
                                    }
                                    $html .= '<tr>';
                                    $html .= '<th colspan="8" style="font-size:15pt; background-color:#cccccc; color:#000000; text-align:right;">Valor Total das Maletas:</th>';
                                    $html .= '<th colspan="2" style="font-size:15pt; background-color:#000000; color:#ffffff; text-align:right;">R$ '.number_format($somaTotal, 2, ',', '.').'</th>';
                                    $html .= '</tr>';
                                    $html .= '<tr>';
                                    $html .= '<th colspan="8" style="font-size:15pt; background-color:#cccccc; color:#000000; text-align:right;">Valor Total Vendido:</th>';
                                    $html .= '<th colspan="2" style="font-size:15pt; background-color:#ffff00; color:#000000; text-align:right;">R$ '.number_format($somaVendido, 2, ',', '.').'</th>';
                                    $html .= '</tr>';
                                    $html .= '<tr>';
                                    $html .= '<th colspan="8" style="font-size:15pt; background-color:#cccccc; color:#000000; text-align:right;">Valor Total das Sobra das Maletas:</td>';
                                    $html .= '<th colspan="2" style="font-size:15pt; background-color:#00ff00; color:#000000; text-align:right;">R$ '.number_format($somaSobraTotal, 2, ',', '.').'</th>';
                                    $html .= '</tr>';
                                    $html .= '<tr>';
                                    $html .= '<th colspan="8" style="font-size:15pt; background-color:#cccccc; color:#000000; text-align:right;">Valor Total Pago ao Revendedor:</th>';
                                    $html .= '<th colspan="2" style="font-size:15pt; background-color:#ff0000; color:#ffffff; text-align:right;">R$ '.number_format($somaPago, 2, ',', '.').'</th>';
                                    $html .= '</tr>';
                                    $html .= '<tr>';
                                    $html .= '<th colspan="8" style="font-size:15pt; background-color:#cccccc; color:#000000; text-align:right;">Valor Lucro:</th>';
                                    $html .= '<th colspan="2" style="font-size:15pt; background-color:#00ff00; color:#000000; text-align:right;">R$ '.number_format($somaLucro, 2, ',', '.').'</th>';
                                    $html .= '</tr>';
                      $html .= '</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>';
    /* ***************************************** */

    require_once '../dompdf/autoload.inc.php';
    use Dompdf\Dompdf;
    $dompdf = new Dompdf();

    /* EXIBIR A IMAGEM NO PDF */
    //$dompdf->loadHtml($aData['html']);
    //$dompdf->set_option('isRemoteEnabled', TRUE);

    $dompdf->loadHtml($html);

    //$dompdf->setPaper('A4', 'landscape');
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    $dompdf->stream("RELATORIO.pdf", array("Attachment"=>false));



?>