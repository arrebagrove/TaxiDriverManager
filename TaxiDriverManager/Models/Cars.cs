using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaxiDriverManager.Models
{
    public partial class Cars
    {
        public int Id { get; set; }
        public string PlateNumber { get; set; }
        public string Brand { get; set; }
        public int? Seats { get; set; }

        [Required]
        public int DriverID { set; get; }
        public virtual Drivers Driver { get; set; }
    }
}
