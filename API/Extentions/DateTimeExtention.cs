using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extentions
{
    public static class DateTimeExtention
    {
        public static int CalculateAge ( this DateTime dof){
            var today = DateTime.Today;
            var age = today.Year - dof.Year;

            if(dof.Date > today.AddYears(-age))
            {
                age --;
            }

            return age;
        }
    }
}