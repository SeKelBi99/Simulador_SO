"use strict";
var estad;
(function (estad) {
    estad["ESPERA"] = "  EN ESPERA  ";
    estad["EJECUCION"] = "EN EJECUCION ";
    estad["FINALIZADO"] = " FINALIZADO  ";
    estad["PAUSADO"] = "   PAUSADO   ";
    estad["REANUDADO"] = "  REANUDADO  ";
    estad["SIN_LLEGADA"] = "NO HA LLEGADO";
})(estad || (estad = {}));

var Proceso = /** @class */ (function () {
    function Proceso(tienLLega, tienCPU, nombre, prioridad) {
        if (nombre === void 0) { nombre = ""; }
        if (prioridad === void 0) { prioridad = NaN; }
        this.tienPausas = [];
        this.tienReinicios = [];
        this.tienLLega = tienLLega;
        this.tienCPU = tienCPU;
        this.tienCPUInicial = tienCPU;
        this.prioridad = prioridad;
        this.tC = NaN;
        this.tEsp = 0;
        this.tFin = NaN;
        this.estad = estad.SIN_LLEGADA;
        this.nombre = nombre;
    }
    Proceso.prototype.setTPausa = function (tP) {
        this.tienPausas.push(tP);
    };
    Proceso.prototype.settienReinicios = function (tR) {
        this.tienReinicios.push(tR);
    };
    Proceso.prototype.setestad = function (e) {
        this.estad = e;
    };
    Proceso.prototype.setNombre = function (nombre) {
        this.nombre = nombre;
    };
    Proceso.prototype.settienLLega = function (tienLLega) {
        this.tienLLega = tienLLega;
    };
    Proceso.prototype.settienCPU = function (tienCPU) {
        this.tienCPU = tienCPU;
    };
    Proceso.prototype.setPrioridad = function (prioridad) {
        this.prioridad = prioridad;
    };
    Proceso.prototype.setTC = function (tC) {
        this.tC = tC;
    };
    Proceso.prototype.setTEsp = function (tEsp) {
        this.tEsp = tEsp;
    };
    Proceso.prototype.setTFin = function (tFin) {
        this.tFin = tFin;
    };
    Proceso.prototype.gettienPausas = function () {
        return this.tienPausas;
    };
    Proceso.prototype.gettienReinicios = function () {
        return this.tienReinicios;
    };
    Proceso.prototype.gettienCPUInicial = function () {
        return this.tienCPUInicial;
    };
    Proceso.prototype.getNombre = function () {
        return this.nombre;
    };
    Proceso.prototype.getestad = function () {
        return this.estad;
    };
    Proceso.prototype.gettienLLega = function () {
        return this.tienLLega;
    };
    Proceso.prototype.gettienCPU = function () {
        return this.tienCPU;
    };
    Proceso.prototype.getPrioridad = function () {
        return this.prioridad;
    };
    Proceso.prototype.getTC = function () {
        return this.tC;
    };
    Proceso.prototype.getTEsp = function () {
        return this.tEsp;
    };
    Proceso.prototype.getTFin = function () {
        return this.tFin;
    };
    return Proceso;
}());

var Fifo = /** @class */ (function () {
    function Fifo() {
        this.proces = [];
        this.reloj = 0;
        this.enEjecucion = null;
    }
    Fifo.prototype.getproces = function () {
        return this.proces;
    };
    Fifo.prototype.getReloj = function () {
        return this.reloj;
    };
    Fifo.prototype.copiar = function (proces) {
        for (var _i = 0, proces_1 = proces; _i < proces_1.length; _i++) {
            var p = proces_1[_i];
            this.proces.push(new Proceso(p.gettienLLega(), p.gettienCPU(), p.getNombre(), p.getPrioridad()));
        }
    };
    Fifo.prototype.menorTllega = function (proces) {
        var menor = null;
        for (var _i = 0, proces_2 = proces; _i < proces_2.length; _i++) {
            var i = proces_2[_i];
            if (i.getestad() == estad.ESPERA) {
                if (menor == null) {
                    menor = i;
                }
                if (i.gettienLLega() < menor.gettienLLega()) {
                    menor = i;
                }
            }
        }
        return menor;
    };
    Fifo.prototype.ejecutarProceso = function (proceso) {
        var _a;
        if (proceso == this.enEjecucion) {
            this.enEjecucion.settienCPU(this.enEjecucion.gettienCPU() - 1);
            if (((_a = this.enEjecucion) === null || _a === void 0 ? void 0 : _a.gettienCPU()) <= 0) {
                proceso.setTFin(this.reloj);
                proceso.setestad(estad.FINALIZADO);
                this.enEjecucion = null;
                if (this.ProceEspera(this.proces)) {
                    var menor = this.menorTllega(this.proces);
                    if (menor != null) {
                        this.enEjecucion = menor;
                        this.enEjecucion.setestad(estad.EJECUCION);
                        this.enEjecucion.setTC(this.reloj);
                        this.enEjecucion.setTEsp(this.enEjecucion.getTC() - this.enEjecucion.gettienLLega());
                    }
                }
            }
        }
        else { 
            this.enEjecucion = proceso;
            proceso.setestad(estad.EJECUCION);
            proceso.setTC(this.reloj);
            proceso.setTEsp(proceso.getTC() - proceso.gettienLLega());
        }
    };
    Fifo.prototype.ProbarLlega = function (proces) {
        for (var _i = 0, proces_3 = proces; _i < proces_3.length; _i++) {
            var p = proces_3[_i];
            if (p.getestad() == estad.SIN_LLEGADA) {
                if (p.gettienLLega() <= this.reloj) {
                    p.setestad(estad.ESPERA);
                }
            }
        }
    };
    Fifo.prototype.ProceEspera = function (proces) {
        for (var _i = 0, proces_4 = proces; _i < proces_4.length; _i++) {
            var p = proces_4[_i];
            if (p.getestad() == estad.ESPERA) {
                return true;
            }
        }
        return false;
    };
    Fifo.prototype.planificar = function (proces) {
        if (this.proces.length == 0) {
            this.copiar(proces);
        }
        if (this.enEjecucion != null) {        
            this.ProbarLlega(this.proces);
            this.ejecutarProceso(this.enEjecucion);
        }
        else { // Si es primera ejecución
            this.ProbarLlega(this.proces);
            if (this.ProceEspera(this.proces)) {
                var menor = this.menorTllega(this.proces);
                if (menor != null) {
                    this.ejecutarProceso(menor);
                }
            }
        }
        console.log("reloj: " + this.getReloj());
        this.reloj++;
    };
    return Fifo;
}());

var SJF = /** @class */ (function () {
    function SJF() {
        this.proces = [];
        this.reloj = 0;
        this.enEjecucion = null;
    }
    SJF.prototype.getproces = function () {
        return this.proces;
    };
    SJF.prototype.getReloj = function () {
        return this.reloj;
    };
    SJF.prototype.copiar = function (proces) {
        for (var _i = 0, proces_5 = proces; _i < proces_5.length; _i++) {
            var p = proces_5[_i];
            this.proces.push(new Proceso(p.gettienLLega(), p.gettienCPU(), p.getNombre(), p.getPrioridad()));
        }
    };
    SJF.prototype.menorTiCPU = function (proces) {
        var menor = null;
        for (var _i = 0, proces_6 = proces; _i < proces_6.length; _i++) {
            var i = proces_6[_i];
            if (i.getestad() == estad.ESPERA) {
                if (menor == null) {
                    menor = i;
                }
                if (i.gettienCPU() < menor.gettienCPU()) {
                    menor = i;
                }
            }
        }
        return menor;
    };
    SJF.prototype.ejecutarProceso = function (proceso) {
        var _a;
        if (proceso == this.enEjecucion) { 
            this.enEjecucion.settienCPU(this.enEjecucion.gettienCPU() - 1);
            if (((_a = this.enEjecucion) === null || _a === void 0 ? void 0 : _a.gettienCPU()) <= 0) {
                proceso.setTFin(this.reloj);
                proceso.setestad(estad.FINALIZADO);
                this.enEjecucion = null;
                if (this.ProceEspera(this.proces)) {
                    var menor = this.menorTiCPU(this.proces);
                    if (menor != null) {
                        this.enEjecucion = menor;
                        this.enEjecucion.setestad(estad.EJECUCION);
                        this.enEjecucion.setTC(this.reloj);
                        this.enEjecucion.setTEsp(this.enEjecucion.getTC() - this.enEjecucion.gettienLLega());
                    }
                }
            }
        }
        else { 
            this.enEjecucion = proceso;
            proceso.setestad(estad.EJECUCION);
            proceso.setTC(this.reloj);
            proceso.setTEsp(proceso.getTC() - proceso.gettienLLega());
        }
    };
    SJF.prototype.ProbarLlega = function (proces) {
        for (var _i = 0, proces_7 = proces; _i < proces_7.length; _i++) {
            var p = proces_7[_i];
            if (p.getestad() == estad.SIN_LLEGADA) {
                if (p.gettienLLega() <= this.reloj) {
                    p.setestad(estad.ESPERA);
                }
            }
        }
    };
    SJF.prototype.ProceEspera = function (proces) {
        for (var _i = 0, proces_8 = proces; _i < proces_8.length; _i++) {
            var p = proces_8[_i];
            if (p.getestad() == estad.ESPERA) {
                return true;
            }
        }
        return false;
    };
    SJF.prototype.planificar = function (proces) {
        if (this.proces.length == 0) {
            this.copiar(proces);
        }
        if (this.enEjecucion != null) {
            this.ProbarLlega(this.proces);
            this.ejecutarProceso(this.enEjecucion);
        }
        else {
            this.ProbarLlega(this.proces);
            if (this.ProceEspera(this.proces)) {
                var menor = this.menorTiCPU(this.proces);
                if (menor != null) {
                    this.ejecutarProceso(menor);
                }
            }
        }
        console.log("reloj SJF: " + this.getReloj());
        this.reloj++;
    };
    return SJF;
}());

var Prioridad = /** @class */ (function () {
    function Prioridad() {
        this.proces = [];
        this.reloj = 0;
        this.enEjecucion = null;
    }
    Prioridad.prototype.getproces = function () {
        return this.proces;
    };
    Prioridad.prototype.getReloj = function () {
        return this.reloj;
    };
    Prioridad.prototype.copiar = function (proces) {
        for (var _i = 0, proces_9 = proces; _i < proces_9.length; _i++) {
            var p = proces_9[_i];
            this.proces.push(new Proceso(p.gettienLLega(), p.gettienCPU(), p.getNombre(), p.getPrioridad()));
        }
    };
    Prioridad.prototype.menorPrioridad = function (proces) {
        var menor = null;
        for (var _i = 0, proces_10 = proces; _i < proces_10.length; _i++) {
            var i = proces_10[_i];
            if (i.getestad() == estad.ESPERA) {
                if (menor == null) {
                    menor = i;
                }
                if (i.getPrioridad() < menor.getPrioridad()) {
                    menor = i;
                }
            }
        }
        return menor;
    };
    Prioridad.prototype.ejecutarProceso = function (proceso) {
        var _a;
        if (proceso == this.enEjecucion) { 
            this.enEjecucion.settienCPU(this.enEjecucion.gettienCPU() - 1);
            if (((_a = this.enEjecucion) === null || _a === void 0 ? void 0 : _a.gettienCPU()) <= 0) {
                proceso.setTFin(this.reloj);
                proceso.setestad(estad.FINALIZADO);
                this.enEjecucion = null;
                if (this.ProceEspera(this.proces)) {
                    var menor = this.menorPrioridad(this.proces);
                    if (menor != null) {
                        this.enEjecucion = menor;
                        this.enEjecucion.setestad(estad.EJECUCION);
                        this.enEjecucion.setTC(this.reloj);
                        this.enEjecucion.setTEsp(this.enEjecucion.getTC() - this.enEjecucion.gettienLLega());
                    }
                }
            }
        }
        else { 
            this.enEjecucion = proceso;
            proceso.setestad(estad.EJECUCION);
            proceso.setTC(this.reloj);
            proceso.setTEsp(proceso.getTC() - proceso.gettienLLega());
        }
    };
    Prioridad.prototype.ProbarLlega = function (proces) {
        for (var _i = 0, proces_11 = proces; _i < proces_11.length; _i++) {
            var p = proces_11[_i];
            if (p.getestad() == estad.SIN_LLEGADA) {
                if (p.gettienLLega() <= this.reloj) {
                    p.setestad(estad.ESPERA);
                }
            }
        }
    };
    Prioridad.prototype.ProceEspera = function (proces) {
        for (var _i = 0, proces_12 = proces; _i < proces_12.length; _i++) {
            var p = proces_12[_i];
            if (p.getestad() == estad.ESPERA) {
                return true;
            }
        }
        return false;
    };
    Prioridad.prototype.planificar = function (proces) {
        if (this.proces.length == 0) {
            this.copiar(proces);
        }
        if (this.enEjecucion != null) {
            this.ProbarLlega(this.proces);
            this.ejecutarProceso(this.enEjecucion);
        }
        else {
            this.ProbarLlega(this.proces);
            if (this.ProceEspera(this.proces)) {
                var menor = this.menorPrioridad(this.proces);
                if (menor != null) {
                    this.ejecutarProceso(menor);
                }
            }
        }
        console.log("reloj Prioridad: " + this.getReloj());
        this.reloj++;
    };
    return Prioridad;
}());

var PrioridadExp = /** @class */ (function () {
    function PrioridadExp() {
        this.proces = [];
        this.reloj = 0;
        this.enEjecucion = null;
    }
    PrioridadExp.prototype.getproces = function () {
        return this.proces;
    };
    PrioridadExp.prototype.getReloj = function () {
        return this.reloj;
    };
    PrioridadExp.prototype.copiar = function (proces) {
        for (var _i = 0, proces_13 = proces; _i < proces_13.length; _i++) {
            var p = proces_13[_i];
            this.proces.push(new Proceso(p.gettienLLega(), p.gettienCPU(), p.getNombre(), p.getPrioridad()));
        }
    };
    PrioridadExp.prototype.menorPrioridad = function (proces) {
        var menor = null;
        for (var _i = 0, proces_14 = proces; _i < proces_14.length; _i++) {
            var i = proces_14[_i];
            if (i.getestad() == estad.ESPERA) {
                if (menor == null) {
                    menor = i;
                }
                if (i.getPrioridad() < menor.getPrioridad()) {
                    menor = i;
                }
                else if (i.getPrioridad() == menor.getPrioridad()) {
                    if (i.gettienLLega() < menor.gettienLLega()) {
                        menor = i;
                    }
                }
            }
        }
        return menor;
    };
    PrioridadExp.prototype.ejecutarProceso = function (proceso) {
        var _a;
        if (proceso == this.enEjecucion) { 
            this.enEjecucion.settienCPU(this.enEjecucion.gettienCPU() - 1);
            if (((_a = this.enEjecucion) === null || _a === void 0 ? void 0 : _a.gettienCPU()) <= 0) {
                proceso.setTFin(this.reloj);
                proceso.setestad(estad.FINALIZADO);
                this.enEjecucion = null;
                if (this.ProceEspera(this.proces)) {
                    var menor = this.menorPrioridad(this.proces);
                    if (menor != null) {
                        this.enEjecucion = menor;
                        if (menor.getTC().toString() == NaN.toString()) {
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.setTC(this.reloj);
                            this.enEjecucion.setTEsp(this.enEjecucion.getTEsp() + this.enEjecucion.getTC() - this.enEjecucion.gettienLLega());
                        }
                        else {
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.settienReinicios(this.reloj);
                            var ultimoTReinicio = this.enEjecucion.gettienReinicios()[this.enEjecucion.gettienReinicios().length - 1];
                            var ultimoTPausa = this.enEjecucion.gettienPausas()[this.enEjecucion.gettienPausas().length - 1];
                            this.enEjecucion.setTEsp(this.enEjecucion.getTEsp() + ultimoTReinicio - ultimoTPausa);
                        }
                    }
                }
            }
            else {
                if (this.ProceEspera(this.proces)) {
                    var menorPrioridad = this.menorPrioridad(this.proces);
                    if (menorPrioridad != null && menorPrioridad.getPrioridad() < this.enEjecucion.getPrioridad()) {
                        this.enEjecucion.setTPausa(this.reloj);
                        this.enEjecucion.setestad(estad.ESPERA);
                        this.enEjecucion = menorPrioridad;
                        if (menorPrioridad.getTC().toString() != NaN.toString()) {      
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.settienReinicios(this.reloj);
                            var ultimoTReinicio = this.enEjecucion.gettienReinicios()[this.enEjecucion.gettienReinicios().length - 1];
                            var ultimoTPausa = this.enEjecucion.gettienPausas()[this.enEjecucion.gettienPausas().length - 1];
                            this.enEjecucion.setTEsp(this.enEjecucion.getTEsp() + ultimoTReinicio - ultimoTPausa);
                        }
                        else { 
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.setTC(this.reloj);
                            this.enEjecucion.setTEsp(this.enEjecucion.getTC() - this.enEjecucion.gettienLLega());
                        }
                    }
                }
            }
        }
        else { 
            this.enEjecucion = proceso;
            proceso.setestad(estad.EJECUCION);
            proceso.setTC(this.reloj);
            proceso.setTEsp(proceso.getTC() - proceso.gettienLLega());
        }
    };
    PrioridadExp.prototype.ProbarLlega = function (proces) {
        for (var _i = 0, proces_15 = proces; _i < proces_15.length; _i++) {
            var p = proces_15[_i];
            if (p.getestad() == estad.SIN_LLEGADA) {
                if (p.gettienLLega() <= this.reloj) {
                    p.setestad(estad.ESPERA);
                }
            }
        }
    };
    PrioridadExp.prototype.ProceEspera = function (proces) {
        for (var _i = 0, proces_16 = proces; _i < proces_16.length; _i++) {
            var p = proces_16[_i];
            if (p.getestad() == estad.ESPERA) {
                return true;
            }
        }
        return false;
    };
    PrioridadExp.prototype.planificar = function (proces) {
        if (this.proces.length == 0) {
            this.copiar(proces);
        }
        if (this.enEjecucion != null) {
            this.ProbarLlega(this.proces);
            this.ejecutarProceso(this.enEjecucion);
        }
        else {
            this.ProbarLlega(this.proces);
            if (this.ProceEspera(this.proces)) {
                var menor = this.menorPrioridad(this.proces);
                if (menor != null) {
                    this.ejecutarProceso(menor);
                }
            }
        }
        console.log("reloj PrioridadEXP: " + this.getReloj());
        this.reloj++;
    };
    return PrioridadExp;
}());

var SRTF = /** @class */ (function () {
    function SRTF() {
        this.proces = [];
        this.reloj = 0;
        this.enEjecucion = null;
    }
    SRTF.prototype.getproces = function () {
        return this.proces;
    };
    SRTF.prototype.getReloj = function () {
        return this.reloj;
    };
    SRTF.prototype.copiar = function (proces) {
        for (var _i = 0, proces_17 = proces; _i < proces_17.length; _i++) {
            var p = proces_17[_i];
            this.proces.push(new Proceso(p.gettienLLega(), p.gettienCPU(), p.getNombre(), p.getPrioridad()));
        }
    };
    SRTF.prototype.menorTiCPU = function (proces) {
        var menor = null;
        for (var _i = 0, proces_18 = proces; _i < proces_18.length; _i++) {
            var i = proces_18[_i];
            if (i.getestad() == estad.ESPERA) {
                if (menor == null) {
                    menor = i;
                }
                if (i.gettienCPU() < menor.gettienCPU()) {
                    menor = i;
                }
                else if (i.gettienCPU() == menor.gettienCPU()) {
                    if (i.gettienLLega() < menor.gettienLLega()) {
                        menor = i;
                    }
                }
            }
        }
        return menor;
    };
    SRTF.prototype.ejecutarProceso = function (proceso) {
        var _a;
        if (proceso == this.enEjecucion) { // Si ya se está ejecutando
            this.enEjecucion.settienCPU(this.enEjecucion.gettienCPU() - 1);
            if (((_a = this.enEjecucion) === null || _a === void 0 ? void 0 : _a.gettienCPU()) <= 0) { // Si terminó  
                proceso.setTFin(this.reloj);
                proceso.setestad(estad.FINALIZADO);
                this.enEjecucion = null;
                if (this.ProceEspera(this.proces)) {
                    var menor = this.menorTiCPU(this.proces);
                    if (menor != null) {
                        this.enEjecucion = menor;
                        if (menor.getTC().toString() == NaN.toString()) {
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.setTC(this.reloj);
                            this.enEjecucion.setTEsp(this.enEjecucion.getTEsp() + this.enEjecucion.getTC() - this.enEjecucion.gettienLLega());
                        }
                        else {
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.settienReinicios(this.reloj);
                            var ultimoTReinicio = this.enEjecucion.gettienReinicios()[this.enEjecucion.gettienReinicios().length - 1];
                            var ultimoTPausa = this.enEjecucion.gettienPausas()[this.enEjecucion.gettienPausas().length - 1];
                            this.enEjecucion.setTEsp(this.enEjecucion.getTEsp() + ultimoTReinicio - ultimoTPausa);
                        }
                    }
                }
            }
            else {
                if (this.ProceEspera(this.proces)) {
                    var menorTiCPU = this.menorTiCPU(this.proces);
                    if (menorTiCPU != null && menorTiCPU.gettienCPU() < this.enEjecucion.gettienCPU()) {
                        this.enEjecucion.setTPausa(this.reloj);
                        this.enEjecucion.setestad(estad.ESPERA);
                        this.enEjecucion = menorTiCPU;
                        if (menorTiCPU.getTC().toString() != NaN.toString()) { // Si menorPriorridad ya se había ejecutado     
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.settienReinicios(this.reloj);
                            var ultimoTReinicio = this.enEjecucion.gettienReinicios()[this.enEjecucion.gettienReinicios().length - 1];
                            var ultimoTPausa = this.enEjecucion.gettienPausas()[this.enEjecucion.gettienPausas().length - 1];
                            this.enEjecucion.setTEsp(this.enEjecucion.getTEsp() + ultimoTReinicio - ultimoTPausa);
                        }
                        else { // Si menorPrioridad se ejecutará por primera vez
                            this.enEjecucion.setestad(estad.EJECUCION);
                            this.enEjecucion.setTC(this.reloj);
                            this.enEjecucion.setTEsp(this.enEjecucion.getTC() - this.enEjecucion.gettienLLega());
                        }
                    }
                }
            }
        }
        else { 
            this.enEjecucion = proceso;
            proceso.setestad(estad.EJECUCION);
            proceso.setTC(this.reloj);
            proceso.setTEsp(proceso.getTC() - proceso.gettienLLega());
        }
    };
    SRTF.prototype.ProbarLlega = function (proces) {
        for (var _i = 0, proces_19 = proces; _i < proces_19.length; _i++) {
            var p = proces_19[_i];
            if (p.getestad() == estad.SIN_LLEGADA) {
                if (p.gettienLLega() <= this.reloj) {
                    p.setestad(estad.ESPERA);
                }
            }
        }
    };
    SRTF.prototype.ProceEspera = function (proces) {
        for (var _i = 0, proces_20 = proces; _i < proces_20.length; _i++) {
            var p = proces_20[_i];
            if (p.getestad() == estad.ESPERA) {
                return true;
            }
        }
        return false;
    };
    SRTF.prototype.planificar = function (proces) {
        if (this.proces.length == 0) {
            this.copiar(proces);
        }
        if (this.enEjecucion != null) {
            this.ProbarLlega(this.proces);
            this.ejecutarProceso(this.enEjecucion);
        }
        else {
            this.ProbarLlega(this.proces);
            if (this.ProceEspera(this.proces)) {
                var menor = this.menorTiCPU(this.proces);
                if (menor != null) {
                    this.ejecutarProceso(menor);
                }
            }
        }
        console.log("reloj SRTF: " + this.getReloj());
        this.reloj++;
    };
    return SRTF;
}());
var control;
(function (control) {
    control[control["FIFO"] = 0] = "FIFO";
    control[control["SJF"] = 1] = "SJF";
    control[control["PRIORIDAD"] = 2] = "PRIORIDAD";
    control[control["PRIORIDAD_EXP"] = 3] = "PRIORIDAD_EXP";
    control[control["SRTF"] = 4] = "SRTF";
})(control || (control = {}));

var planiFac = /** @class */ (function () {
    function planiFac() {
    }
    planiFac.crearPlanificador = function (tipo) {
        var p;
        switch (tipo) {
            case control.FIFO:
                p = new Fifo();
                break;
            case control.SJF:
                p = new SJF();
                break;
            case control.PRIORIDAD:
                p = new Prioridad();
                break;
            case control.PRIORIDAD_EXP:
                p = new PrioridadExp();
                break;
            case control.SRTF:
                p = new SRTF();
                break;
            default:
                p = new Fifo();
                ;
                break;
        }
        return p;
    };
    return planiFac;
}());

var planiMang = /** @class */ (function () {
    function planiMang() {
    }
    planiMang.getInstance = function () {
        if (planiMang.instance == null) {
            planiMang.instance = new planiMang();
        }
        return planiMang.instance;
    };
    planiMang.prototype.planificar = function (proces, planificadorCPU) {
        planificadorCPU.planificar(proces);
    };
    planiMang.instance = null;
    return planiMang;
}());
var Modo;
(function (Modo) {
    Modo[Modo["RAPIDO"] = 0] = "RAPIDO";
    Modo[Modo["LENTO"] = 1000] = "LENTO";
})(Modo || (Modo = {}));
var Tabla;
(function (Tabla) {
    Tabla["FIFO"] = "FIFOTabla";
    Tabla["SJF"] = "SJFTabla";
    Tabla["PRIORIDAD"] = "PRIORIDADTabla";
    Tabla["PRIORIDAD_EXP"] = "PRIORIDAD_EXPTabla";
    Tabla["SRTF"] = "SRTFTabla";
})(Tabla || (Tabla = {}));

var Simulador = /** @class */ (function () {
    function Simulador(tipoAlg) {
        this.proces = [];
        this.intervalos = [];
        this.planificadores = [];
        this.modo = Modo.LENTO;
        this.numproces = 0;
    }
    Simulador.prototype.nuevoProceso = function (tienLLega, tienCPU, nombre, prioridad) {
        if (nombre === void 0) { nombre = ""; }
        if (prioridad === void 0) { prioridad = NaN; }
        if (this.numproces <= 5) {
            this.numproces++;
            nombre = "P" + this.numproces;
            this.proces.push(new Proceso(tienLLega, tienCPU, nombre, prioridad));
        }
    };
    Simulador.prototype.getProceso = function (i) {
        return this.proces[i];
    };
    Simulador.prototype.getproces = function () {
        return this.proces;
    };
    Simulador.prototype.setModo = function (modo) {
        this.modo = modo;
    };
    Simulador.prototype.getModo = function () {
        return this.modo;
    };
    Simulador.prototype.pausa = function () {
        for (var _i = 0, _a = this.intervalos; _i < _a.length; _i++) {
            var intervalo = _a[_i];
            clearInterval(intervalo);
        }
        btPausa === null || btPausa === void 0 ? void 0 : btPausa.setAttribute("disabled", "true");
    };
    Simulador.tabEvent = function (tabId) {
        var tabOpciones = document.getElementsByTagName("nav")[1].getElementsByTagName("a");
        for (var i = 0; i < tabOpciones.length; i++) {
            tabOpciones[i].className = tabOpciones[i].className.replace(" active", "");
        }
        var tabcontent = document.getElementsByClassName("container");
        for (var i = 0; i < tabcontent.length; i++) {
            tabcontent[i].setAttribute("style", "display: none");
        }
        var elemento = document.getElementById(tabId);
        if (elemento != null) {
            elemento.className += " active";
        }
        var idContent = tabId += "Content";
        var contentElement = document.getElementById(idContent);
        contentElement === null || contentElement === void 0 ? void 0 : contentElement.setAttribute("style", "display: block");
    };
    Simulador.prototype.actualizarTablas = function () {
        this.actualizarTabla(Tabla.FIFO, this.proces);
        this.actualizarTabla(Tabla.SJF, this.proces);
        this.actualizarTabla(Tabla.PRIORIDAD, this.proces);
        this.actualizarTablaExp(Tabla.PRIORIDAD_EXP, this.proces);
        this.actualizarTablaExp(Tabla.SRTF, this.proces);
    };
    Simulador.prototype.actualizarTabla = function (idTabla, proces) {
        var tabla = document.getElementById(idTabla);
        var elementoTEspTotal = document.getElementById(idTabla + "_TTEsp");
        var tiempoEsperaTotal = 0;
        for (var i = 1; i < proces.length + 1; i++) {
            var proceso = proces[i - 1];
            tabla.rows[i].cells[0].innerText = proceso.getNombre();
            tabla.rows[i].cells[1].innerText = "" + proceso.gettienLLega();
            tabla.rows[i].cells[2].innerText = "" + proceso.gettienCPU();
            if (idTabla == Tabla.PRIORIDAD) {
                tabla.rows[i].cells[3].innerText = "" + proceso.getPrioridad();
                tabla.rows[i].cells[4].innerText = "" + proceso.getTC();
                tabla.rows[i].cells[5].innerText = "" + proceso.getTFin();
                tabla.rows[i].cells[6].innerText = "" + proceso.getTEsp();
                tabla.rows[i].cells[7].innerText = proceso.getestad();
            }
            else {
                tabla.rows[i].cells[3].innerText = "" + proceso.getTC();
                tabla.rows[i].cells[4].innerText = "" + proceso.getTFin();
                tabla.rows[i].cells[5].innerText = "" + proceso.getTEsp();
                tabla.rows[i].cells[6].innerText = proceso.getestad();
            }
            tiempoEsperaTotal += proceso.getTEsp();
            elementoTEspTotal.innerHTML = "TIEMPO DE ESPERA TOTAL: " + tiempoEsperaTotal;
        }
    };
    Simulador.prototype.actualizarTablaExp = function (idTabla, proces) {
        var tabla = document.getElementById(idTabla);
        var elementoTEspTotal = document.getElementById(idTabla + "_TTEsp");
        var tiempoEsperaTotal = 0;
        for (var i = 1; i < proces.length + 1; i++) {
            var proceso = proces[i - 1];
            tabla.rows[i].cells[0].innerText = proceso.getNombre();
            tabla.rows[i].cells[1].innerText = "" + proceso.gettienLLega();
            tabla.rows[i].cells[2].innerText = "" + proceso.gettienCPU();
            if (idTabla == Tabla.PRIORIDAD_EXP) {
                tabla.rows[i].cells[3].innerText = "" + proceso.getPrioridad();
                tabla.rows[i].cells[4].innerText = "" + proceso.getTC();
                tabla.rows[i].cells[5].innerText = "" + proceso.gettienPausas();
                tabla.rows[i].cells[6].innerText = "" + proceso.gettienReinicios();
                tabla.rows[i].cells[7].innerText = "" + proceso.getTFin();
                tabla.rows[i].cells[8].innerText = "" + proceso.getTEsp();
                tabla.rows[i].cells[9].innerText = proceso.getestad();
            }
            else {
                tabla.rows[i].cells[3].innerText = "" + proceso.getTC();
                tabla.rows[i].cells[4].innerText = "" + proceso.gettienPausas();
                tabla.rows[i].cells[5].innerText = "" + proceso.gettienReinicios();
                tabla.rows[i].cells[6].innerText = "" + proceso.getTFin();
                tabla.rows[i].cells[7].innerText = "" + proceso.getTEsp();
                tabla.rows[i].cells[8].innerText = proceso.getestad();
            }
            tiempoEsperaTotal += proceso.getTEsp();
            elementoTEspTotal.innerHTML = "TIEMPO DE ESPERA TOTAL: " + tiempoEsperaTotal;
        }
    };
    Simulador.prototype.reinicioProce = function () {
        this.planificadores = [];
    };
    Simulador.prototype.verificarestad = function (proces) {
        for (var i = 0; i < proces.length; i++) {
            if (proces[i].getestad() != estad.FINALIZADO) {
                return;
            }
        }
        simulador.pausa();
        btInicio === null || btInicio === void 0 ? void 0 : btInicio.setAttribute("disabled", "true");
        btReinicio === null || btReinicio === void 0 ? void 0 : btReinicio.removeAttribute("disabled");
        btRecarga === null || btRecarga === void 0 ? void 0 : btRecarga.removeAttribute("disabled");
    };
    Simulador.prototype.simularTodo = function (planificadores) {
        var pManager = planiMang.getInstance();
        pManager.planificar(simulador.getproces(), planificadores[0]);
        simulador.verificarestad(planificadores[0].getproces());
        simulador.actualizarTabla(Tabla.FIFO, planificadores[0].getproces());
        pManager.planificar(simulador.getproces(), planificadores[1]);
        simulador.verificarestad(planificadores[1].getproces());
        simulador.actualizarTabla(Tabla.SJF, planificadores[1].getproces());
        pManager.planificar(simulador.getproces(), planificadores[2]);
        simulador.verificarestad(planificadores[2].getproces());
        simulador.actualizarTabla(Tabla.PRIORIDAD, planificadores[2].getproces());
        pManager.planificar(simulador.getproces(), planificadores[3]);
        simulador.verificarestad(planificadores[3].getproces());
        simulador.actualizarTablaExp(Tabla.PRIORIDAD_EXP, planificadores[3].getproces());
        pManager.planificar(simulador.getproces(), planificadores[4]);
        simulador.verificarestad(planificadores[4].getproces());
        simulador.actualizarTablaExp(Tabla.SRTF, planificadores[4].getproces());
    };
    Simulador.prototype.simular = function () {
        this.planificadores.push(planiFac.crearPlanificador(control.FIFO));
        this.planificadores.push(planiFac.crearPlanificador(control.SJF));
        this.planificadores.push(planiFac.crearPlanificador(control.PRIORIDAD));
        this.planificadores.push(planiFac.crearPlanificador(control.PRIORIDAD_EXP));
        this.planificadores.push(planiFac.crearPlanificador(control.SRTF));
        this.intervalos.push(setInterval(this.simularTodo, this.modo, this.planificadores));
    };
    return Simulador;
}());
var simulador = new Simulador(control.FIFO);

function inicio() {
    simulador.simular();
    btInicio === null || btInicio === void 0 ? void 0 : btInicio.setAttribute("disabled", "true");
    btPausa === null || btPausa === void 0 ? void 0 : btPausa.removeAttribute("disabled");
    btReinicio === null || btReinicio === void 0 ? void 0 : btReinicio.setAttribute("disabled", "true");
    btRecarga === null || btRecarga === void 0 ? void 0 : btRecarga.setAttribute("disabled", "true");
}
function pausa() {
    simulador.pausa();
    btInicio === null || btInicio === void 0 ? void 0 : btInicio.removeAttribute("disabled");
    btReinicio === null || btReinicio === void 0 ? void 0 : btReinicio.removeAttribute("disabled");
    btRecarga === null || btRecarga === void 0 ? void 0 : btRecarga.removeAttribute("disabled");
}
function reinicio() {
    simulador.reinicioProce();
    simulador.actualizarTablas();
    btInicio === null || btInicio === void 0 ? void 0 : btInicio.removeAttribute("disabled");
    btPausa === null || btPausa === void 0 ? void 0 : btPausa.setAttribute("disabled", "true");
    btReinicio === null || btReinicio === void 0 ? void 0 : btReinicio.setAttribute("disabled", "true");
    btRecarga === null || btRecarga === void 0 ? void 0 : btRecarga.setAttribute("disabled", "true");
}

function nuevoProceso() {
    var tienLLega = +document.getElementsByTagName("input")[0].value;
    var tienCPU = +document.getElementsByTagName("input")[1].value;
    var prioridad = +document.getElementsByTagName("input")[2].value;
    simulador.nuevoProceso(tienLLega, tienCPU, "", prioridad);
    var inputs = document.getElementsByTagName("input");
    inputs[0].value = "";
    inputs[1].value = "";
    inputs[2].value = "";
    simulador.actualizarTablas();
}
var btInicio = document.getElementById("inicio");
var btPausa = document.getElementById("pausa");
var btReinicio = document.getElementById("reinicio");
var btRecarga = document.getElementById("recarga");
