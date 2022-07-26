using UnityEngine;
using UnityEngine.UI;

public class ShieldsDisplay : MonoBehaviour {

    [SerializeField] Image[] m_images;

    public int totalShieldCount => m_images.Length;

    private CarController m_car;
    
    public void Initialize (CarController car) {
        this.m_car = car;
        InitDisplay();
        m_car.onShieldsGained += OnShieldsGained;
        m_car.onShieldsLost += OnShieldsLost;
    }

    void InitDisplay () {
        int i=0;
        for(; i<m_car.currentArmor; i++){
            m_images[i].enabled = true;
        }
        for(; i<m_images.Length; i++){
            m_images[i].enabled = false;
        }
    }

    void OnShieldsGained () {
        InitDisplay();
    }

    void OnShieldsLost () {
        InitDisplay();
    }

}
