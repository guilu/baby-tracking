<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 24/8/15
 * Time: 12:19
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Event;
use AppBundle\Entity\EventType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tracker controller
 *
 * @Route("/track")
 */
class TrackController extends Controller
{

    /**
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @Route("/new", name="new-event")
     * @Method("POST")
     */
    public function newAction(Request $request)
    {
        $type          = $request->get('type');
        $em            = $this->get('doctrine.orm.entity_manager');
        $eventTypeRepo = $em->getRepository('AppBundle:EventType');

        // Make sure that the event type is valid
        $eventType = $eventTypeRepo->findOneBy(array('name' => $type));

        $subtype = $request->get('subtype');
        $value   = $request->get('value');

        if ($eventType->getName() == 'Dormir') {
            /** @var Event $lastSleepEvent */
            $lastSleepEvent = $em->getRepository('AppBundle:Event')->findLastEventOfType($eventType);

            if ($lastSleepEvent && $lastSleepEvent->getSubType() == 'start') {
                $subtype = 'end';
            } else {
                $subtype = 'start';
            }
        }

        // Create new event
        $event = new Event();
        $event->setEventType($eventType);
        $event->setSubType($subtype);
        $event->setValue($value);
        $eventType->getEvents()->add($event);

        $em->persist($eventType);
        $em->persist($event);
        $em->flush();

        return new JsonResponse(
            array(
                'success' => true,
                'event'   => $this->formatEvent($event),
            )
        );
    }

    /**
     * @param Request $request
     *
     * @Route("/update", name="update-event")
     * @Method("POST")
     *
     * @return JsonResponse
     */
    public function updateAction(Request $request)
    {
        $em           = $this->get('doctrine.orm.entity_manager');
        $event        = $em->getRepository('AppBundle:Event')->find($request->get('id'));
        $clonedDT     = clone $event->getCreatedAt();
        $clonedDT->sub(new \DateInterval('PT'.$request->get('minutes').'M'));

        $event->setCreatedAt($clonedDT);

        $em->persist($event);
        $em->flush();

        return new JsonResponse(
            array(
                'success' => true,
                'event'   => $this->formatEvent($event, true),
            )
        );
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @Route("/delete", name="delete-event")
     * @Method("POST")
     */
    public function deleteAction(Request $request)
    {
        $em    = $this->get('doctrine.orm.entity_manager');
        $event = $em->getRepository('AppBundle:Event')->find($request->get('id'));

        $em->remove($event);
        $em->flush();

        return new JsonResponse(
            array(
                'success' => true,
                'event'   => $this->formatEvent($event, true),
            )
        );
    }

    /**
     * Lists all Event entities.
     *
     * @Route("/list", name="get-event-list")
     * @Method("GET")
     *
     * @return JsonResponse
     */
    public function getListAction()
    {
        $eventRepo = $this->get('doctrine.orm.entity_manager')->getRepository('AppBundle:Event');
        $events    = $eventRepo->findLatest(40);
        $list      = array();

        foreach ($events as $event) {
            $list[] = $this->formatEvent($event);
        }

        return new JsonResponse($list);
    }

    /**
     * Lists all Event entities.
     *
     * @Route("/stats", name="get-event-stats")
     * @Method("GET")
     *
     * @return JsonResponse
     */
    public function getStats()
    {
        $result         = array();
        $eventTypeNames = array('Leche', 'Sacaleche', 'Panyal', 'Dormir', 'Comida');

        $em = $this->get('doctrine.orm.entity_manager');

        foreach ($eventTypeNames as $eventTypeName) {
            /** @var EventType $feedType */
            $eventType = $em->getRepository('AppBundle:EventType')->findOneBy(array('name' => $eventTypeName));
            /** @var Event $last */
            $last = $em->getRepository('AppBundle:Event')->findLastEventOfType($eventType);

            $result[strtolower($eventTypeName)] = array(
                'time'  => is_null($last) ? '' : $this->get('helpers')->formatDateDiff($last->getCreatedAt()),
                'type'  => is_null($last) ? '' : $last->getSubType(),
                'value' => is_null($last) ? '' : $last->getValue(),
            );
        }

        return new JsonResponse($result);
    }

    /**
     * Metodo privado para formatear un evento....
     *
     * @param            $event
     * @param bool|false $reverted
     *
     * @return array
     */
    private function formatEvent(Event $event, $reverted = false)
    {
        setlocale(LC_TIME, 'es_ES');
        //$event->getCreatedAt()->format('l d/m/Y H:i:s');
        return array(
            'id'       => $event->getId(),
            'reverted' => $reverted,
            'type'     => array(
                'name'       => $event->getEventType()->getName(),
                'icon'       => $event->getEventType()->getIcon(),
                'color_name' => $event->getEventType()->getColorName(),
                'is_primary' => $event->getEventType()->isPrimary(),
            ),
            'time'     => strftime('%a %d/%m/%Y %H:%M:%S', $event->getCreatedAt()->getTimestamp()),
            'subtype'  => $event->getSubType(),
            'value'    => $event->getValue(),
        );
    }
}
