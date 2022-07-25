using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class ShowMedal : MonoBehaviour
{
    public GameObject medalObj;
    public string quote;
    public Sprite spriteMedal;
    
    public List<Sprite> medalImages;
    private List<string> medalQuotes = new List<string>();
    private TextMeshProUGUI medalText;

    public void Start()
    {
        FillMedalQuotes();
    }

    private void FillMedalQuotes()
    {
        medalQuotes.Add("Albtraum aller ADAC Pannenhilfen");
        medalQuotes.Add("Fuehrerschein bei Wish bestellt");
        medalQuotes.Add("Die Versicherung dankt");
        medalQuotes.Add("Frueher bist du so schoen gefahren");
        medalQuotes.Add("Einmal ist Keinmal");
        medalQuotes.Add("Oh Oh das wird teuer");
        medalQuotes.Add("Crash-King wieder am Start");
        medalQuotes.Add("Schrecken der Strassen");
        medalQuotes.Add("Bringt eure Kinder in Sicherheit!");
        medalQuotes.Add("Hihi Auto macht Brumm Brumm Knirsch");
        medalQuotes.Add("Kriegst demnaechst dann Post aus Flensburg");
        medalQuotes.Add("Kennzeichen ist notiert");
        medalQuotes.Add("Anzeige ist raus");
        medalQuotes.Add("Das wurde dir in der Fahrschule besser beigebracht");
    }

    public void CallMedal()
    {
        // change model of the medal
        spriteMedal = medalImages[Random.Range(0, medalImages.Count - 1)];
        
        // change text on the medal
        quote = medalQuotes[Random.Range(0, medalQuotes.Count - 1)];
    }
}
