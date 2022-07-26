using KenCars;
using UnityEngine;

public class CarController : MonoBehaviour {

    private const int MAX_HEALTH = 3;
    private const float BOOST_SPEED = 25;

    [Header("Components")]
    [SerializeField] Rigidbody m_actualBody;
    [SerializeField] HealthBar m_healthBar;
    [SerializeField] ShieldsDisplay m_shieldsDisplay;
    [SerializeField] Vehicle m_vehicle;

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

    void Start () {
        currentHealth = MAX_HEALTH;
        currentArmor = 0;

        m_healthBar.Initialize(this);
        m_shieldsDisplay.Initialize(this);
    }

    void OnCollisionEnter (Collision collision) {
        if(isDead) return;
        if(collision.gameObject.tag != "Ground"){
            Debug.Log("Collided with: " + collision.gameObject.name);
            var impulseDot = Vector3.Dot(collision.impulse.normalized, Vector3.up);
            Debug.Log(impulseDot);
            Debug.DrawRay(collision.contacts[0].point, collision.impulse, Color.white, 2f);
            if (collision.gameObject.tag == "TheEnd"){
                TakeDamage(MAX_HEALTH);
            }else if(hasShields){
                CallMedal();
                currentArmor--;
                onShieldsLost();
            }else{
                TakeDamage(1);
                if(!isDead){
                    CallMedal();
                    if (collision.gameObject.tag == "Damage"){
                        Debug.Log("Collide normally");
                    }else if (collision.gameObject.tag == "BigSmall"){
                        Debug.LogWarning("Big Small effect has been disabled!");
                    }else if (collision.gameObject.tag == "Cone"){
                        Debug.Log("Collide with Road Cone");
                        m_vehicle.sphere.velocity = Vector3.Lerp(m_vehicle.sphere.velocity, Vector3.zero, Time.deltaTime * 1000f);
                        collision.gameObject.GetComponent<Rigidbody>().AddForce(Vector3.back * 5000.0f);
                    }
                }
            }
        }
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

    public bool TryGetShields () {
        if(currentArmor < m_shieldsDisplay.totalShieldCount){
            currentArmor = m_shieldsDisplay.totalShieldCount;
            onShieldsGained();
            return true;
        }
        return false;
    }

    void TakeDamage (int damage) {
        currentHealth -= damage;
        onDamaged();
        if(isDead){
            Debug.Log("TODO game over");    // TODO does this call something or does the gamemanager get a call?
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

    // public void ResetScene()
    // {
    //     Scene scene = SceneManager.GetActiveScene();
    //     SceneManager.LoadScene(scene.name);
    // }

}
