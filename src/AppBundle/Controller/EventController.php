<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\Entity\Event;
use AppBundle\Form\EventType;

/**
 * Event controller.
 *
 * @Route("/event")
 */
class EventController extends Controller
{

    /**
     * Lists all Event entities.
     *
     * @Route("/", name="event")
     * @Method("GET")
     * @Template()
     *
     * @return Template
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('AppBundle:Event')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new Event entity.
     *
     * @param Request $request
     *
     * @Route("/", name="event_create")
     * @Method("POST")
     * @Template("AppBundle:Event:new.html.twig")
     *
     * @return Template
     */
    public function createAction(Request $request)
    {
        $entity = new Event();
        $form   = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('event_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Displays a form to create a new Event entity.
     *
     * @Route("/new", name="event_new")
     * @Method("GET")
     * @Template()
     *
     * @return Template
     */
    public function newAction()
    {
        $entity = new Event();
        $form   = $this->createCreateForm($entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Finds and displays a Event entity.
     *
     * @param string $id
     *
     * @Route("/{id}", name="event_show")
     * @Method("GET")
     * @Template()
     *
     * @return Template
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AppBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Event entity.
     *
     * @param string $id
     *
     * @Route("/{id}/edit", name="event_edit")
     * @Method("GET")
     * @Template()
     *
     * @return Template
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AppBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $editForm   = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an event
     *
     * @param Request $request
     * @param string  $id
     *
     *      * @Route("/{id}", name="event_update")
     * @Method("PUT")
     * @Template("AppBundle:Event:edit.html.twig")
     *
     * @return array|\Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AppBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('event_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Event entity.
     *
     * @param Request $request
     * @param string  $id
     *
     * @Route("/{id}", name="event_delete")
     * @Method("DELETE")
     *
     * @return Template
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em     = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('AppBundle:Event')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException("No se ecuentra el evento $idF.");
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('event'));
    }

    /**
     * Creates a form to create a Event entity.
     *
     * @param Event $entity The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Event $entity)
    {
        $form = $this->createForm(
            new EventType(),
            $entity,
            array(
                'action' => $this->generateUrl('event_create'),
                'method' => 'POST',
            )
        );

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Creates a form to edit a Event entity.
     *
     * @param Event $entity The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Event $entity)
    {
        $form = $this->createForm(
            new EventType(),
            $entity,
            array(
                'action' => $this->generateUrl('event_update', array('id' => $entity->getId())),
                'method' => 'PUT',
            )
        );

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }

    /**
     * Creates a form to delete a Event entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('event_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm();
    }
}
