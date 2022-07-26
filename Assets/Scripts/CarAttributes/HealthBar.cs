using UnityEngine;
using UnityEngine.UI;

public class HealthBar : MonoBehaviour {

    [SerializeField] Slider m_slider;
    [SerializeField] Gradient m_gradient;
    [SerializeField] Image m_fill;

    private CarController m_car;
    
    public void Initialize (CarController car) {
        this.m_car = car;
        m_slider.maxValue = car.maxHealth;
        InitDisplay();
        m_car.onDamaged += OnDamaged;
        m_car.onHealed += OnHealed;
    }

    void InitDisplay () {
        m_slider.value = m_car.currentHealth;
        m_fill.color = m_gradient.Evaluate(m_slider.normalizedValue);
    }

    void OnDamaged () {
        InitDisplay();
    }

    void OnHealed () {
        InitDisplay();
    }

}
