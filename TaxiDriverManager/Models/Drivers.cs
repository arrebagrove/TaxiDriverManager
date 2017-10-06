using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaxiDriverManager.Models
{
    public partial class Drivers
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string CurrentStatus { get; set; }

        [Required]
        public string Email { get; set; }
        public Cars Car { get; set; }
        public List<Positions> Positions { get; set; }
    }
}
