using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ShowMedal : MonoBehaviour
{
    public List<Sprite> medalImages;
    [SerializeField] private TextMeshProUGUI medalText;

    private GameObject medalObj;
    private List<string> medalQuotes = new List<string>();
    private bool collided = false;
    private bool showImage = true;

    public void Start()
    {
        medalObj = GameObject.Find("Medal");
        medalObj.SetActive(false);

        FillMedalQuotes();
    }

    public void Update()
    {
        if(collided && showImage)
        {
            if(medalQuotes.Count == 0)
            {
                FillMedalQuotes();
            }
            collided = false;
            showImage = false;
            string quote = medalQuotes[Random.Range(0, medalQuotes.Count - 1)];
            medalText.text = quote;

            Sprite currImage = medalImages[Random.Range(0, medalImages.Count - 1)];
            medalObj.GetComponent<Image>().sprite = currImage;
            medalObj.SetActive(true);

            medalQuotes.Remove(quote);

            StartCoroutine(SetInactive());
        }
    }

    IEnumerator SetInactive()
    {
        yield return new WaitForSeconds(4f);
        medalObj.SetActive(false);
        showImage = true;
    }

    public void OnCollisionEnter(Collision other)
    {
        if(showImage)
        {
            collided = true;
        }
    }

    private void FillMedalQuotes()
    {
        medalQuotes.Add("Albtraum aller ADAC Pannenhilfen");
        medalQuotes.Add("Führerschein bei Wish bestellt");
        medalQuotes.Add("Die Versicherung dankt");
        medalQuotes.Add("Früher bist du so schön gefahren");
        medalQuotes.Add("Einmal ist Keinmal");
        medalQuotes.Add("Oh Oh das wird teuer");
        medalQuotes.Add("Crash-King wieder am Start");
        medalQuotes.Add("Schrecken der Straßen");
        medalQuotes.Add("Bringt eure Kinder in Sicherheit!");
        medalQuotes.Add("Hihi Auto macht Brumm Brumm Knirsch");
        medalQuotes.Add("Kriegst demnächst dann Post aus Flensburg");
        medalQuotes.Add("Kennzeichen ist notiert");
        medalQuotes.Add("Anzeige ist raus");
        medalQuotes.Add("Das wurde dir in der Fahrschule besser beigebracht");
    }
}
