using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SportsPro.Models;

namespace SportsPro.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Product()
    {
        return View();
    }

    public IActionResult Technician()
    {
        return View();
    }


    public IActionResult Customer()
    {
        return View();
    }


    public IActionResult Incident()
    {
        return View();
    }


    public IActionResult Registration()
    {
        return View();
    }

    [Route("[action]")]
    public IActionResult About()
    {
        return View();
    }

}

