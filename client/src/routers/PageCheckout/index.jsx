
import Header from "../../components/Header"
import Form  from "../../components/Form"
import RadioGroup from "../../components/RadioGroup"
import Input from "../../components/Input"
import Select from "../../components/Select"
import Checkbox from "../../components/Checkbox"

import { useNavigate } from "react-router-dom"

import {cardSchema} from "../../formRelatedMethods/schemas/form"

import { Container } from "./styles"

import userRequests from "../../requestsAPI/user/actions"
import { useState } from "react"

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

export default function PageCheckout(){
    const productsInCartStorage  = JSON.parse(localStorage.getItem("productsInTheCart")) || [] 
    const navigate = useNavigate()
    if(productsInCartStorage.length === 0) return navigate("/")

    const ProductCart = ({product}) => {
      return (
        <li>
          <p>Vendido por Sportify e enviado por Sportify</p>
          <div className="product">
            <div className="sup">
              <img src={product.cover} />
              <article>
                <p>
                  <b>{product.title}</b>
                </p>
                <ul className="options-product">
                  {product.options.colors && (
                    <span>
                      <b>Cor: </b>
                      {product.options.colors}
                    </span>
                  )}
                  {product.options.clothingSizes && (
                    <span>
                      <b>Tamanho: </b>
                      {product.options.clothingSizes}
                    </span>
                  )}
                  {product.options.shoeSizes && (
                    <span>
                      <b>Tamanho: </b>
                      {product.options?.shoeSizes}
                    </span>
                  )}
                </ul>
              </article>
            </div>
            <div className="sub">
              <RadioGroup
                radios={[
                  {
                    value: "",
                    label: (
                      <span>
                        <b>Normal: R$17,90</b>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </li>
      );
    };

    const Addressbox = ()=>{
        const [addressData, setAddressData] = useState({})
        userRequests.addressesData().then(address=>{
            setAddressData(address.addressesData.addresses[0])
        })
        return (
            <div className="address-box">
                <h5>Principal</h5>
                <main>
                    <span>{addressData?.nameOfStreet}, {addressData?.number}</span>
                    <span>CEP {addressData?.cep} - {addressData?.city} - {addressData?.state?.split(" ").map(car=> car[0].toUpperCase()).join("") }</span>
                </main>
                <span>Quer receber seu pedido em outro endere??o?</span>
                <button>Alterar endere??o</button>
            </div>
        )
    }


    const OrderSumaryBox = ({products})=>{
        const valueFreigth = products.length * 17.90
        const valueTotal = products.map(prod=> prod.value.valueTotal).reduce((prev, current)=> current + prev)
        return (
            <div className="order-sumary-box">
                <ul>
                    <li className="infos-value">
                        <span><b>Itens do Pedido</b></span>
                        <span><b>Qtde</b></span>
                        <span><b>Pre??o</b></span>
                    </li>
                    {
                        products.map((prod, index)=>(
                            <li className="infos-value" key={index}>
                                <span>{prod.title}</span>
                                <span>{prod.quantity} und</span>
                                <span>R$ {prod.value.valueTotal.toFixed(2).replace(".", ",")}</span>
                            </li>
                        ))
                    }
                    <hr/>
                    <li className="main-info">
                        <span>Frete</span>
                        <span>R$ {valueFreigth.toFixed(2).replace(".", ",")}</span>
                    </li>
                    <li className="main-info">
                        <span><b>Valor total</b></span>
                        <span><b>R$ {valueTotal.toFixed(2).replace(".", ",")}</b></span>
                    </li>
                </ul>
            </div>
        )
    }

    const PaymantPIXBox = ()=>{
        return (
          <div className="paymant-pix">
            <h3>
              <i className="bx bx-qr"></i>Pagar com PIX
            </h3>
            <h4>R$ 239,13</h4>
            <ul className="pix-step-list">
              <li>
                <span>1</span>Ap??s a finaliza????o do pedido, abra o app ou banco
                de sua prefer??ncia. Escolha a op????o pagar com c??digo Pix ???copia
                e cola???, ou c??digo QR. O c??digo tem validade de 30 minutos.
              </li>
              <li>
                <span>2</span>Copie e cole o c??digo, ou escaneie o c??digo Qr com
                a c??mera do seu celular. Confira todas as informa????es e autorize
                o pagamento.
              </li>
              <li>
                <span>3</span>Voc?? vai receber a confirma????o de pagamento no seu
                e-mail e atrav??s dos nossos canais. E pronto!
              </li>
            </ul>
            <button>FINALIZAR PEDIDO COM PIX</button>
          </div>
        );
    }

    const ListProductsBox = ({products})=>{
        return (
            <div className="products-sumary">
                <h3><i className='bx bxs-truck' ></i>Selecione o tipo de entrega</h3>
                <ul className="products-list-ul">
                    { products.map((prod, index)=> (<ProductCart key={index} product={prod}/>)) }
                </ul>
            </div>
        )
    }

    const FormCardPaymentBox = ()=>{
        const {
            control,
            handleSubmit,
            formState: { errors },
          } = useForm({resolver: yupResolver(cardSchema)});

          function handlePayment(data){
            console.log(data)
          }
        return (
            <div className="payment-form-card">
                <h3><i className='bx bx-credit-card-alt'></i>Pagar com cart??o de cr??dito</h3>
                <Form style={{marginTop: "2rem"}} onSubmit={handleSubmit(handlePayment)}>
                    <Controller
                        control={control}
                        name="numberCard"
                        render={({ field: { onChange } }) => (
                            <Input onChange={onChange} style={{width: 450}} variant="filled" size="small" label="N??mero do cart??o" /> 
                        )}
                    />
                    <Controller
                        control={control}
                        name="nameCardHolder"
                        render={({ field: { onChange } }) => (
                            <Input onChange={onChange} style={{width: 450, marginTop: "1rem"}} variant="filled" size="small" label="Nome do titular (como gravado no cart??o)"/>
                        )}
                    />
                
                    <div style={{ marginTop: "1.5rem"}}>
                        <h5>DATA DE VALIDADE DO CART??O</h5>
                        <div style={{ marginTop: ".5rem"}}>
                            <Controller
                                control={control}
                                name="expiryMonth"
                                render={({ field: { onChange } }) => (
                                    <Select onClickOption={onChange} numberInterval={[1, 12]} style={{width: "calc(225px - 0.5rem)", marginRight: "1rem"}} variant="filled" size="small" label="M??s"/>
                                )}
                            />
                            <Controller
                                control={control}
                                name="expiryYear"
                                render={({ field: { onChange } }) => (
                                    <Select onClickOption={onChange} numberInterval={[23, 53]} style={{width: "calc(225px - 0.5rem)"}} variant="filled" size="small" label="Ano"/>
                                )}
                            />
                            
                        </div>
                    </div>
                    <div style={{marginTop: "1.5rem"}}>
                        <h5>C??DIGO DE SEGURAN??A</h5>
                            <Controller
                                control={control}
                                name="cvv"
                                render={({ field: { onChange } }) => (
                                    <Input onChange={onChange} type="number" style={{width: 300, marginTop: ".5rem"}} variant="filled" size="small" label="cvv"/>
                                )}
                            />
                    </div>
                    <Controller
                        control={control}
                        name="saveCard"
                        render={({ field: { onChange } }) => (
                            <Checkbox onChange={onChange} style={{marginTop: "1.5rem"}} label={<b style={{fontSize: ".7rem"}}>SALVAR CART??O</b>}/>
                        )}
                    />
                    <div style={{marginTop: "1.5rem"}}>
                        <h5>PARCELAMENTO</h5>
                        <Controller
                            control={control}
                            name="installment"
                            render={({ field: { onChange } }) => (
                                <Select onClickOption={onChange} numberInterval={[1, 4]} style={{width: 300, marginTop: "0.5rem"}} variant="filled" size="small" label="Parcelar em at??"/>
                            )}
                        />
                    </div>
                    <button className="button-pay" type="submit">Finalizar pedido com cart??o de cr??dito</button>
                </Form>
            </div>
        )
    }

    return (
       <div>
            <Header searchBar={false} navUser={false} cart={false}/>
            <Container>
                <div className="content">
                    <div className="shipping-payment">
                        <h3 className="title-head">Frete e pagamento</h3>
                        <div className="card-list-container">
                            <ul className="notes-list">
                                <li className="note-box">
                                    <ListProductsBox products={productsInCartStorage}/>
                                </li>
                                <li className="note-box">
                                    <PaymantPIXBox/>
                                </li>
                                <li className="note-box">
                                    <FormCardPaymentBox/>
                                </li>
                            </ul>   
                        </div>
                    </div>
                    <div className="address-summary">
                        <h3 className="title-head">Endere??o e resumo do pedido</h3>
                        <ul className="notes-list">
                            <li className="note-box">
                                <h3><i className='bx bxs-home-alt-2' ></i>Endere??o de entrega</h3>
                                <Addressbox/>
                            </li>
                            <li className="note-box">
                                <h3><i className='bx bxs-note'></i>Resumo do pedido</h3>
                                <OrderSumaryBox products={productsInCartStorage}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </Container>
       </div>
    )
}