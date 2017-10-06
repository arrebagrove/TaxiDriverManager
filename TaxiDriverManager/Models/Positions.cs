using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaxiDriverManager.Models
{
    public partial class Positions
    {


        public int Id { get; set; }
        public int? Area { get; set; }
        public DateTime? TimeStamp { get; set; }

        [Required]
        public int DriverId { get; set; }
        public Drivers Driver { get; set; }
    }
}
