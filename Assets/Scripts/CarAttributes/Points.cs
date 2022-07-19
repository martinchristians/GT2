using TMPro;
using UnityEngine;

public class Points : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI countDownText;

    private GameObject car;
    
    private void Start()
    {
        car = GameObject.Find("vehicle");
    }

    private void Update()
    {
        float zPos = car.transform.position.z;
        if(zPos >= 0) {
            countDownText.text = "Score: " + (car.transform.position.z * 10).ToString("0");
        }
        
    }
}
