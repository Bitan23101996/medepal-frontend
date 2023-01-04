export class UtilsFactory {


   public static phoneEmailValidation(value) {
        if (isNaN(value)) {
          const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          if (reg.test(value) == false) {
            return false;
          }
        }
        else if (value.length != 10) {
          return false;
        }
        else {
          const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
          if (!value.match(phoneno)) {
            return false;
          }
        }
        return true;
      }

      public static emailValidation(value) {
        if (isNaN(value)) {
          const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          if (reg.test(value) == false) {
            return false;
          }
        }
        return true;
      }

      public static phoneValidation(value) {
        const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return phoneno.test(value);
      }

      public static getDayByNumber(noOfDay) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if(noOfDay==7){
          return days[0];
        }
        return days[noOfDay];
      }
}