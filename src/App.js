import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader,Table,Button,FormGroup,Container } from 'reactstrap';
import swal from 'sweetalert';


const url='http://localhost:3000/prospecto';



class App extends React.Component{
  state={

    data: [],
    form:{
      id:'',
      nombre:'',
      pApellido:'',
      sApellido:'',
      calle:'',
      numero: '',
      colonia:'',
      cPostal:'',
      telefono:'',
      rfc:'',
      statuss:'',
      observaciones:''
      
    },
    modalCapturar: false,
    modalMostrar: false,
    modalEvaluar: false,
    modalDocumentos: false
  }

  peticionGet=()=>{
    axios.get(url).then(response=>{
        this.setState({data: response.data});
        
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPost=async()=>{
    delete this.state.form.id
    delete this.state.form.observaciones;
    delete this.state.form.statuss;
    console.log(this.state.form);
    if(this.iscamposVacio(this.state.form)== true){
      this.mostrarAlertaVacio();
    }
    else{

      await axios.post(url,this.state.form).then(response=>{
        this.mostrarExitoso();
        this.modalCapturar();
        this.peticionGet();
      }).catch(error=>{
        console.log(error.message)
      })

    }

  }
  peticionPut=()=>{
    if(!this.state.form.observaciones==''){
      axios.put(url+'/id/'+this.state.form.id, this.state.form).then(response=>{
        this.modalEvaluar();
        this.peticionGet();
      })     
    }else{
      this.mostrarAlertaVacio();
    }

  }

  modalCapturar=()=>{
    this.setState({modalCapturar: !this.state.modalCapturar});
    this.limpiarStateForm();
    
  }
  modalMostrar=()=>{
    this.setState({modalMostrar: !this.state.modalMostrar});
    this.limpiarStateForm();
  
  }
  modalEvaluar=()=>{
    this.setState({modalEvaluar: !this.state.modalEvaluar});
    this.limpiarStateForm();

  }

  seleccionarProspecto=(elemento)=>{
    this.setState({
      form: {
        nombre:elemento.nombre,
        pApellido:elemento.pApellido,
        sApellido:elemento.sApellido,
        calle:elemento.calle,
        numero: elemento.numero,
        colonia:elemento.colonia,
        cPostal:elemento.cPostal,
        telefono:elemento.telefono,
        rfc:elemento.rfc,
        statuss:elemento.statuss,
        observaciones:elemento.observaciones
      }
    })
    this.modalMostrar();
    
  }

  seleccionarProspectoEvaluar=(elemento)=>{
    console.log(elemento);
    this.setState({
      form: {
        id:elemento.id,
        nombre:elemento.nombre,
        pApellido:elemento.pApellido,
        sApellido:elemento.sApellido,
        calle:elemento.calle,
        numero: elemento.numero,
        colonia:elemento.colonia,
        cPostal:elemento.cPostal,
        telefono:elemento.telefono,
        rfc:elemento.rfc,
        statuss:elemento.statuss,
        observaciones:elemento.observaciones
      }
    })
    this.modalEvaluar();
  }


  mostrarAlerta=()=>{
    swal({
      text: "Estás seguro que deseas salir? los datos no serán guardados.",
      icon: "warning",
      buttons: ["Aceptar","Cancelar"]


    }).then(respuesta=>{
        if(!respuesta==true){
          console.log('dio aceptar')
          this.modalCapturar();
        }
        else{
          console.log('dio cancelar')
        }
       
    })

  }
  mostrarAlertaVacio=()=>{
    swal({
      text: "Los campos no pueden estár vacios",
      icon: "warning",
      button: "Aceptar"
    })

  }
  mostrarExitoso=()=>{
    swal({
      text: "El prospecto ha sido añadido exitosamente",
      icon: "success",
      button: false,
      timer: 1500
    })

  }

  iscamposVacio=(elemento)=>{
    if(elemento.nombre==''| 
    elemento.pApellido=='' | 
    elemento.sApellido==''|
    elemento.calle==''|
    elemento.numero==''|
    elemento.colonia==''|
    elemento.cPostal==''|
    elemento.telefono==''|
    elemento.rfc==''
    ){
      return true;
    }
    else{
      return false;
    }

  }

  limpiarStateForm(){
    
    
    this.state.form.nombre='';
    this.state.form.pApellido='';
    this.state.form.sApellido='';
    this.state.form.calle='';
    this.state.form.numero='';
    this.state.form.colonia='';
    this.state.form.cPostal='';
    this.state.form.telefono='';
    this.state.form.rfc='';

  }
  modalDocumentos=()=>{
    this.setState({modalDocumentos: !this.state.modalDocumentos});

  }

  componentDidMount(){
    this.peticionGet();

    

  }
  handleChange=e=>{
    this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value,
      }
    });
    console.log(this.state.form);
  }


  render(){
    const {form}=this.state;
    return(
      <>
      <Container>
      <br />
      <img class="logo" src="concredito-logo.png"/>
      <br/>
      <Button color='success' onClick={()=>this.modalCapturar()}>Capturar Prospecto</Button>
      <br />
      <Table>
        <thead>
          <tr>
          <th>Nombre</th>
          <th>Primer Apellido</th>
          <th>Segundo Apellido</th>
          <th>Status</th>
          </tr>
          </thead>
        <tbody>
          {this.state.data.map(elemento=>{
            return(
              <tr>
              <td>{elemento.nombre}</td>
              <td>{elemento.pApellido}</td>
              <td>{elemento.sApellido}</td>
              <td>{elemento.statuss}</td>
              <td><Button color='primary'onClick={()=>this.seleccionarProspecto(elemento)}>Seleccionar</Button>{" "}
              <Button color='warning'onClick={()=>this.modalDocumentos()}>Documentos</Button>{" "}
              <Button color='danger' onClick={()=>this.seleccionarProspectoEvaluar(elemento)}>Evaluar</Button></td>
            </tr>

            )

            })}

        </tbody>
      </Table>


      </Container>

      <Modal isOpen={this.state.modalCapturar}>
          <ModalHeader>
           <div><h3>Capturar Prospecto</h3></div>
          </ModalHeader>

          <ModalBody>

            
            <FormGroup>
              <label> Nombre:</label>
              <input className="form-control" name="nombre" type="text" onChange={this.handleChange}/>
            </FormGroup>
            
            <FormGroup>
              <label>Primer Apellido:</label>
              <input className="form-control"  name="pApellido"  type="text"  onChange={this.handleChange} />
            </FormGroup>
                        
            <FormGroup>
              <label>Segundo Apellido:</label>
              <input className="form-control"  name="sApellido"  type="text"  onChange={this.handleChange} />
            </FormGroup>
                        
            <FormGroup>
              <label>Calle:</label>
              <input className="form-control"  name="calle"  type="text"  onChange={this.handleChange} />
            </FormGroup>
                        
            <FormGroup>
              <label>Numero:</label>
              <input className="form-control"  name="numero"  type="number"  onChange={this.handleChange} />
            </FormGroup>
                        
            <FormGroup>
              <label>Colonia:</label>
              <input className="form-control"  name="colonia"  type="text"  onChange={this.handleChange} />
            </FormGroup>
                        
            <FormGroup>
              <label>Codigo Postal:</label>
              <input className="form-control"  name="cPostal"  type="number"  onChange={this.handleChange} />
            </FormGroup>
                        
            <FormGroup>
              <label>Telefono:</label>
              <input className="form-control"  name="telefono"  type="number"  onChange={this.handleChange} />
            </FormGroup>
                        
            <FormGroup>
              <label>RFC:</label>
              <input className="form-control"  name="rfc"  type="text"  onChange={this.handleChange} />
            </FormGroup>
                                  
            
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.peticionPost()}
              
            >
              Capturar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.mostrarAlerta()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalMostrar}>
          <ModalHeader>
           <div><h3> Prospecto </h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup>
              <label> Nombre:</label>
              <input className="form-control" name="nombre" type="text" onChange={this.handleChange}
              readOnly
              value={this.state.form.nombre}/>
            </FormGroup>
            
            <FormGroup>
              <label>Primer Apellido:</label>
              <input className="form-control"  name="pApellido"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.pApellido}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Segundo Apellido:</label>
              <input className="form-control"  name="sApellido"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.sApellido}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Calle:</label>
              <input className="form-control"  name="calle"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.calle}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Numero:</label>
              <input className="form-control"  name="numero"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.numero}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Colonia:</label>
              <input className="form-control"  name="colonia"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.colonia}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Codigo Postal:</label>
              <input className="form-control"  name="cPostal"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.cPostal}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Telefono:</label>
              <input className="form-control"  name="telefono"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.telefono}/>
            </FormGroup>
                        
            <FormGroup>
              <label>RFC:</label>
              <input className="form-control"  name="rfc"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.rfc}/>
            </FormGroup>
            <FormGroup>
              <label>Status:</label>
              <input className="form-control"  name="statuss"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.statuss}/>
            </FormGroup>
            <FormGroup>
              <label>Observaciones:</label>
              <textarea className="form-control textarea"  name="Observaciones" placeholder='Sin Observaciones' type="text" onChange={this.handleChange}
              readOnly
              value={this.state.form.observaciones}/>
            </FormGroup>
            
          </ModalBody>
          
          <ModalFooter>
            <Button
              color="danger"
              onClick={() => this.modalMostrar()}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEvaluar}>
          <ModalHeader>
           <div><h3> Prospecto </h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup>
              <label> Nombre:</label>
              <input className="form-control" name="nombre" type="text" onChange={this.handleChange}
              readOnly
              value={this.state.form.nombre}/>
            </FormGroup>
            
            <FormGroup>
              <label>Primer Apellido:</label>
              <input className="form-control"  name="pApellido"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.pApellido}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Segundo Apellido:</label>
              <input className="form-control"  name="sApellido"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.sApellido}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Calle:</label>
              <input className="form-control"  name="calle"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.calle}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Numero:</label>
              <input className="form-control"  name="numero"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.numero}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Colonia:</label>
              <input className="form-control"  name="colonia"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.colonia}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Codigo Postal:</label>
              <input className="form-control"  name="cPostal"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.cPostal}/>
            </FormGroup>
                        
            <FormGroup>
              <label>Telefono:</label>
              <input className="form-control"  name="telefono"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.telefono}/>
            </FormGroup>
                        
            <FormGroup>
              <label>RFC:</label>
              <input className="form-control"  name="rfc"  type="text"  onChange={this.handleChange}
              readOnly
              value={this.state.form.rfc}/>
            </FormGroup>
            <FormGroup>
            <label>Status:</label>
              <select class="form-control form-control-sm"  name="statuss" value={this.state.form.statuss}  type="text" onChange={this.handleChange}>
              <option>Enviado</option>
              <option>Autorizado</option>
              <option>Rechazado</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Observaciones:</label>
              <textarea className="form-control textarea"  name="observaciones"  type="text" onChange={this.handleChange}
              value={this.state.form.observaciones}/>
            </FormGroup>
            
          </ModalBody>
          
          <ModalFooter>
          <Button
              color="primary"
              onClick={() => this.peticionPut()}
            >
              Aceptar
            </Button>
            <Button
              color="danger"
              onClick={() => this.modalEvaluar()}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalDocumentos}>
          <ModalHeader>
           <div><h3> Documentos </h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup action="/uploadmultiple"  enctype="multipart/form-data" method="POST">

                  <input type="file" name="myFiles" multiple/>
       
            </FormGroup>
            
          </ModalBody>
          
          <ModalFooter>
          <Button
              color="primary" typeof='submit'

            >
              Aceptar
            </Button>
            <Button
              color="danger"
              onClick={() => this.modalDocumentos()}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>

      </>)
  }

}


export default App;