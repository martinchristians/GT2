using System.Collections.Generic;
using KenCars;
using UnityEngine;

public class CarController : MonoBehaviour {

    public static CarController current { get; private set; }

    private const int MAX_HEALTH = 3;
    private const float BOOST_SPEED = 25;
    private const float DAMAGE_COOLDOWN_LENGTH = 0.333f;
    private const float DAMAGE_DELTA_V_THRESHOLD = 2;

    [Header("Components")]
    [SerializeField] Rigidbody m_actualBody;
    [SerializeField] HealthBar m_healthBar;
    [SerializeField] ShieldsDisplay m_shieldsDisplay;
    [SerializeField] Vehicle m_vehicle;
    [SerializeField] VehicleCamera m_camController;

    public int maxHealth => MAX_HEALTH;
    public int currentHealth { get; private set; }
    public bool isDead => currentHealth <= 0;
    public int currentArmor { get; private set; }
    public bool hasShields => currentArmor > 0;

    public event System.Action onDamaged = delegate {};
    public event System.Action onHealed = delegate {};
    public event System.Action onDied = delegate {};

    public event System.Action onShieldsGained = delegate {};
    public event System.Action onShieldsLost = delegate {};

    public Vector3 position => m_actualBody.position;
    public bool isGrounded => m_vehicle.isGrounded;

    bool m_collidedWithSomething;
    bool m_collidedWithSomethingDamaging;
    float m_lastDamagingCollisionTime;
    List<Environment.Obstacle> m_hitObstacles;
    Vector3 m_lastVelocity;

    public bool inputBlocked {
        get => !m_vehicle.controllable;
        set => m_vehicle.controllable = !value;
    }

    void Awake () {
        current = this;
    }

    void Start () {
        m_hitObstacles = new List<Environment.Obstacle>();
        m_lastVelocity = m_actualBody.velocity;
        m_lastDamagingCollisionTime = float.NegativeInfinity;
        m_collidedWithSomething = false;
        m_collidedWithSomethingDamaging = false;

        currentHealth = MAX_HEALTH;
        currentArmor = 0;

        m_healthBar.Initialize(this);
        m_shieldsDisplay.Initialize(this);
    }

    void FixedUpdate () {
        var currentVelocity = m_actualBody.velocity;
        if(m_collidedWithSomething){
            var deltaV = Vector3.ProjectOnPlane(currentVelocity - m_lastVelocity, Vector3.up);
            ProcessCollision(deltaV);
        }
        m_lastVelocity = currentVelocity;
        m_hitObstacles.Clear();
        m_collidedWithSomething = false;
        m_collidedWithSomethingDamaging = false;
    }

    void ProcessCollision (Vector3 deltaV) {
        var wouldDealDamage = deltaV.magnitude > DAMAGE_DELTA_V_THRESHOLD;
        if(wouldDealDamage){
            foreach(var obstacle in m_hitObstacles){
                if(obstacle != null){
                    obstacle.OnHit(this);
                }
            }
            var shouldDealDamage = m_collidedWithSomethingDamaging && (Time.time > m_lastDamagingCollisionTime + DAMAGE_COOLDOWN_LENGTH);
            if(shouldDealDamage){
                m_lastDamagingCollisionTime = Time.time;
                if(currentArmor > 0){
                    currentArmor--;
                    onShieldsLost();
                }else{
                    TakeDamage(1);
                }
            }
        }
    }

    void OnCollisionEnter (Collision collision) {
        if(isDead || collision.gameObject.tag == "Ground") return;
        m_collidedWithSomething = true;
        if(collision.gameObject.TryGetComponent<Environment.Obstacle>(out var obstacle)){
            m_hitObstacles.Add(obstacle);
            m_collidedWithSomethingDamaging |= obstacle.dealsDamage;
        }else{
            m_collidedWithSomethingDamaging = true;
        }
        // if(collision.gameObject.tag != "Ground"){
        //     Debug.Log("Collided with: " + collision.gameObject.name);
        //     if (collision.gameObject.tag == "TheEnd"){
        //         TakeDamage(MAX_HEALTH);
        //     }else if(hasShields){
        //         CallMedal();
        //         currentArmor--;
        //         onShieldsLost();
        //     }else{
        //         TakeDamage(1);
        //         if(!isDead){
        //             CallMedal();
        //             if (collision.gameObject.tag == "Damage"){
        //                 Debug.Log("Collide normally");
        //             }else if (collision.gameObject.tag == "BigSmall"){
        //                 Debug.LogWarning("Big Small effect has been disabled!");
        //             }else if (collision.gameObject.tag == "Cone"){
        //                 Debug.Log("Collide with Road Cone");
        //                 m_vehicle.sphere.velocity = Vector3.Lerp(m_vehicle.sphere.velocity, Vector3.zero, Time.deltaTime * 1000f);
        //                 collision.gameObject.GetComponent<Rigidbody>().AddForce(Vector3.back * 5000.0f);
        //             }
        //         }
        //     }
        // }
    }

    public void Boost (Vector3 boostVector) {
        m_actualBody.velocity = boostVector.normalized * BOOST_SPEED;
        m_vehicle.transform.rotation = Quaternion.LookRotation(Vector3.ProjectOnPlane(boostVector, Vector3.up));
    }

    public bool TryHeal () {
        if(currentHealth < MAX_HEALTH){
            currentHealth++;
            onHealed();
            return true;
        }
        return false;
    }

    public bool TryGainShields () {
        if(currentArmor < m_shieldsDisplay.totalShieldCount){
            currentArmor = m_shieldsDisplay.totalShieldCount;
            onShieldsGained();
            return true;
        }
        return false;
    }

    public void Kill () {
        TakeDamage(currentHealth);
    }

    void TakeDamage (int damage) {
        if(isDead) return;
        currentHealth -= damage;
        onDamaged();
        if(isDead){
            onDied();
            m_vehicle.controllable = false;
            m_camController.followPosition = false;
        }
    }

    void CallMedal() {
        // try{
        //     showMedal.CallMedal();
        //     showMedal.medalObj.GetComponent<Image>().sprite = showMedal.spriteMedal;
        //     showMedal.medalObj.GetComponent<Image>().enabled = true;

        //     showMedal.medalObj.transform.GetChild(0).gameObject.GetComponent<TextMeshProUGUI>().text = showMedal.quote;
        //     showMedal.medalObj.transform.GetChild(0).gameObject.GetComponent<TextMeshProUGUI>().enabled = true;

        //     StartCoroutine(SetInactive());
        // }catch{
        //     Debug.LogWarning("naughty");
        // }

        // IEnumerator SetInactive()
        // {
        //     yield return new WaitForSeconds(4f);
        //     showMedal.medalObj.GetComponent<Image>().enabled = false;
        //     showMedal.medalObj.transform.GetChild(0).gameObject.GetComponent<TextMeshProUGUI>().enabled = false;
        // }
    }

}
