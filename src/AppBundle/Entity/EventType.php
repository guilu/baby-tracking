<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 21/8/15
 * Time: 8:35
 */

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\EventTypeRepository")
 * @ORM\HasLifecycleCallbacks()
 *
 * @author Diego Barrio <diegobarrioh@gmail.com>
 */
class EventType
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="event_types.blank_name")
     */
    private $name;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="event_types.blank_webname")
     */
    private $webname;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     */
    private $icon;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="event_types.blank_color_name")
     */
    private $colorName;

    /**
     * @ORM\Column(type="boolean", options={"default":false})
     */
    private $isPrimary;

    /**
     * @var \DateTime $created
     *
     * @ORM\Column(type="datetime")
     */
    protected $createdAt;

    /**
     * @var \DateTime $updated
     *
     * @ORM\Column(type="datetime", nullable = true)
     */
    protected $updatedAt;

    /**
     * @ORM\OneToMany(
     *      targetEntity="AppBundle\Entity\Event",
     *      mappedBy="eventType",
     *      cascade={"remove"},
     *      orphanRemoval=true
     * )
     * @ORM\OrderBy({"createdAt" = "DESC"})
     */
    protected $events;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->events = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getWebname()
    {
        return $this->webname;
    }

    /**
     * @param mixed $webname
     */
    public function setWebname($webname)
    {
        $this->webname = $webname;
    }

    /**
     * @return mixed
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param mixed $icon
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;
    }

    /**
     * @return mixed
     */
    public function getColorName()
    {
        return $this->colorName;
    }

    /**
     * @param mixed $colorName
     */
    public function setColorName($colorName)
    {
        $this->colorName = $colorName;
    }

    /**
     * @return mixed
     */
    public function isPrimary()
    {
        return $this->isPrimary;
    }

    /**
     * @param mixed $isPrimary
     */
    public function setIsPrimary($isPrimary)
    {
        $this->isPrimary = $isPrimary;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Gets triggered only on insert
     *
     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->createdAt = new \DateTime("now");
    }

    /**
     * Gets triggered every time on update
     *
     * @ORM\PreUpdate
     */
    public function onPreUpdate()
    {
        $this->updatedAt = new \DateTime("now");
    }

    /**
     * @return Collection
     */
    public function getEvents()
    {
        return $this->events;
    }

    /**
     * @param mixed $events
     */
    public function setEvents($events)
    {
        $this->events = $events;
    }

    /**
     * @param Event $event
     */
    public function addEvent(Event $event)
    {
        $this->events->add($event);
        $event->setEventType($this);
    }

    /**
     * @param Event $event
     */
    public function removeEvent(Event $event)
    {
        $this->events->remove($event);
        $event->setEventType(null);
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }


    /**
     * @inheritdoc
     * @return mixed
     */
    public function __toString()
    {
        return $this->getName();
    }
}
