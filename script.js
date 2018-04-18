new Vue({
  el: '#app',
  data: {
    prices:[
        {
            coating: [300, 450, 510, 570] //black metal
        },
        {
            coating: [300, 450, 510, 570] //stainless steel
        },
        {
            coating: [300, 450, 510, 570] //non-ferrous metal
        },
        {
            coating: [170, 212.5, 195.5, 229.5, 246.5] //brick
        },
        {
            coating: [170, 195.5] //granite
        },
        {
            coating: [170, 195.5] //marble
        },
        {
            coating: [170, 221, 255] //concrete
        },
        {
            coating: [170, 187, 170] //wood
        }
    ],
    typeOfCoatting: [1, 1.3, 1.5],
    material:null, // Материал
    surface:null, // Поверхность
    coating:null, // Покрытие
    surfaceArea:null, // Площадь поверхности
    brigadeDeparture:null, // Выезд бригады
    outsideMKAD:null, // км за МКАДом
    painting:null, // Покраска
    cleaning:false, // уборка
    showPainting:false,
    showSurfaceField:false, // Показывать поле Поверхность
    showOutsideMKADField:false, // Показывать поле Расстояния или нет
    showSurfaceAreaField:false,
    paintingCoefficient:null
  },
  watch: {
    material: function() {
      "use strict";

      if(this.prices[this.material].coating.length<=this.coating-1){
              this.coating = 0; //проверяем, индекс покрытия, если он больше, чем есть значений в coating, материала - будет ошибка Nan в total, например, если выбрать карпич, и покрытие - "штукатурка", сменить материал на дерево - будет Nan
      }
      return this.showSurfaceField = true;
    },
    surface: function(){
      "use strict";
      return this.showPainting = true;
      },

    coating: function() {
      "use strict";

        return this.showSurfaceAreaField = true;
    },
    painting: function() {
          "use strict";
          if(this.painting===1){
            return this.paintingCoefficient = 25/100;
          }
          else if(this.painting===2){
              return this.paintingCoefficient = 35/100;
          }
          else if(this.painting===3){
              return this.paintingCoefficient = 50/100;
          }
          else{return this.paintingCoefficient = 1};
      },

    brigadeDeparture: function() {
      return this.brigadeDeparture===2?this.showOutsideMKADField=true:false

    }
  },
  computed: {
    total: function() {
      // some calculation
        if(this.material!==null&&this.coating!==null&&this.surfaceArea!==null){

            var priceCoating = this.prices[this.material].coating[this.coating];

            var surfaceCoefficient = this.typeOfCoatting[this.surface];

            var area = Math.abs(+this.surfaceArea);//площадь

            var priceOfWork = priceCoating*surfaceCoefficient*area;
            //стоимость работы (базовая величина без покраски, уборки)
            console.log(priceOfWork);

            var priceOfCleaning = this.cleaning?area * 40:0; //стоимость уборки

            var priceOfPainting = this.painting?priceOfWork * this.paintingCoefficient:0;//стоимость покраски

            var brigadeCost = 0;/*рассчет стоимости бригады*/

            if(this.brigadeDeparture&&!this.outsideMKAD){

              if(priceOfWork>50000){
                  brigadeCost = 0; //если стоимость работы больше 50 к, в пределах Мкад - бесплатно
              }else{
                brigadeCost = 4000
              } //если меньше 50 к, - 4000 руб.
            }
            else if(this.brigadeDeparture&&this.outsideMKAD){

                if(priceOfWork>50000){
                    brigadeCost = Math.abs(this.outsideMKAD)*100;
                    //если стоимость работы больше 50 к, в пределах Мкад - бесплатно
                }else{
                  brigadeCost = Math.abs(this.outsideMKAD)*100+4000;
                  //если меньше 50000 руб = количество км*100+4000руб
                }
            }
            var total = priceOfWork + priceOfCleaning + priceOfPainting + brigadeCost;


            return (this.brigadeDeparture&&total<15000?15000:total).toFixed(0).replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
        }
        else if(this.material!==null&&this.coating!==null&&this.surfaceArea===null){
            if(this.brigadeDeparture){return '15000'.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')}
        }
    }
  },
    mounted:function(){
    "use strict";
        document.querySelector('#material1').checked = false;
    }
});
