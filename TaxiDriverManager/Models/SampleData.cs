using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiDriverManager.Data;

namespace TaxiDriverManager.Models
{
    public class SampleData
    {
        public async void Setup(RoleManager<IdentityRole> _roleManager, UserManager<ApplicationUser> _userManager)
        {

            bool SuperAdminExists = await _roleManager.RoleExistsAsync("SuperAdmin");
            if (!SuperAdminExists)
            {
                IdentityRole newRole = new IdentityRole("SuperAdmin");
                await _roleManager.CreateAsync(newRole);
            }

            bool AdminExists = await _roleManager.RoleExistsAsync("Admin");
            if (!AdminExists)
            {
                IdentityRole newRole = new IdentityRole("Admin");
                await _roleManager.CreateAsync(newRole);
            }

            bool UserExists = await _roleManager.RoleExistsAsync("User");
            if (!UserExists)
            {
                IdentityRole newRole = new IdentityRole("User");
                await _roleManager.CreateAsync(newRole);
            }

            ApplicationUser sa = await _userManager.FindByEmailAsync("patrik5000@gmail.com");
            bool saIsSa = await _userManager.IsInRoleAsync(sa, "SuperAdmin");
            if (sa == null)
            {
                var user = new ApplicationUser { UserName = "patrik5000@gmail.com", Email = "patrik5000@gmail.com" };
                var result = await _userManager.CreateAsync(user, "Patrik.995");
            }
            if (sa != null && !saIsSa)
            {
                await _userManager.AddToRoleAsync(sa, "SuperAdmin");
            }

        }


       /* public void initTestData() {

            using (var ctx = new ApplicationDbContext())
            {
                Cars car = new Cars() { PlateNumber = "AAA-000" };
                Drivers driver = new Drivers() { FirstName = "Test", LastName = "Driver", Car = car };

                ctx.Drivers.Add(driver);
                ctx.SaveChanges();
            }

        } */
    }
}
